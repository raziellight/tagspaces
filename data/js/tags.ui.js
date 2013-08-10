/* Copyright (c) 2012-2013 The TagSpaces Authors. All rights reserved.
 * Use of this source code is governed by a AGPL3 license that 
 * can be found in the LICENSE file. */
define(function(require, exports, module) {
"use strict";

	console.log("Loading tags.ui.js...");
	
	var TSCORE = require("tscore");

	function initContextMenus() {
        $( "#extMenuAddTagAsFilter" ).click( function() {
            TSCORE.PerspectiveManager.setFileFilter(TSCORE.selectedTag);
        });

        // Context menu for the tags in the file table and the file viewer
        $( "#tagMenuAddTagAsFilter" ).click( function() {
            TSCORE.PerspectiveManager.setFileFilter(TSCORE.selectedTag);
        });
        
        $( "#tagMenuEditTag" ).click( function() {
            TSCORE.showTagEditDialog();
        });
        
        $( "#tagMenuRemoveTag" ).click( function() {
            TSCORE.TagUtils.removeTag(TSCORE.selectedFiles[0],TSCORE.selectedTag);
        });                

        $( "#tagMenuMoveTagRight" ).click( function() {
            TSCORE.TagUtils.moveTagLocation(TSCORE.selectedFiles[0],TSCORE.selectedTag, "next");
        });                

        $( "#tagMenuMoveTagLeft" ).click( function() {
            TSCORE.TagUtils.moveTagLocation(TSCORE.selectedFiles[0],TSCORE.selectedTag, "prev");
        });                
	
	    // Context menu for the tags in the tag tree
        $( "#tagTreeMenuAddTagToFile" ).click( function() {
            TSCORE.TagUtils.addTag(TSCORE.selectedFiles, [TSCORE.selectedTag]);  
        });                

        $( "#tagTreeMenuAddTagAsFilter" ).click( function() {
            TSCORE.PerspectiveManager.setFileFilter(TSCORE.selectedTag);
        });                

        $( "#tagTreeMenuEditTag" ).click( function() {
            TSCORE.showTagEditInTreeDialog();
        });                

        $( "#tagTreeMenuDeleteTag" ).click( function() {
            TSCORE.showConfirmDialog(
                "Delete Tag",
                "Do you want to delete this tag from the taggroup?",
                function() {
                    TSCORE.Config.deleteTag(TSCORE.selectedTagData);
                    generateTagGroups();                              
                }
            );
        });                
	    
	    // Context menu for the tags groups
        $( "#tagGroupMenuCreateNewTag" ).click( function() {
            TSCORE.showDialogTagCreate();
        });                

        $( "#tagGroupMenuCreateTagGroup" ).click( function() {
            TSCORE.showDialogTagGroupCreate();
        });                

        $( "#tagGroupMenuMoveUp" ).click( function() {
            TSCORE.Config.moveTagGroup(TSCORE.selectedTagData, "up");
            generateTagGroups(); 
        });                

        $( "#tagGroupMenuMoveDown" ).click( function() {
            TSCORE.Config.moveTagGroup(TSCORE.selectedTagData, "down");
            generateTagGroups(); 
        });                

        $( "#tagGroupMenuEditTagGroup" ).click( function() {
            TSCORE.showDialogEditTagGroup();
        });                

        $( "#tagGroupMenuDeleteTagGroup" ).click( function() {
            TSCORE.showConfirmDialog(
                "Delete TagGroup",
                "Do you want to delete this taggroup?",
                function() {
                    TSCORE.Config.deleteTagGroup(TSCORE.selectedTagData);
                    generateTagGroups();                              
                }
            );
        });                
	}
	
	function initDialogs() {
        $( "#editTagInTreeButton" ).click( function() {
            TSCORE.Config.editTag(
                TSCORE.selectedTagData, 
                $( "#tagInTreeName" ).val(), 
                $( "#tagColor" ).val(),
                $( "#tagTextColor" ).val()
                )
            generateTagGroups();    
        });   

        $( "#addTagsButton" ).click( function() {
            var tags = $("#tags").val().split(",");
            TSCORE.TagUtils.addTag(TSCORE.selectedFiles, tags);
        });             

        $( "#createTagButton" ).click( function() {
            TSCORE.Config.createTag(TSCORE.selectedTagData, $( "#newTagTitle" ).val() )
            generateTagGroups();                    
        });             
	                
        $( "#createTagGroupButton" ).click( function() {
            TSCORE.Config.createTagGroup(TSCORE.selectedTagData, $( "#newTagGroupName" ).val() )
            generateTagGroups();                    
        });             

        $( "#editTagGroupButton" ).click( function() {
            TSCORE.Config.editTagGroup(TSCORE.selectedTagData, $( "#tagGroupName" ).val() )
            generateTagGroups();                    
        });           
	}
	
	function generateTagGroups() {
	    console.log("Generating TagGroups...");
	    $("#tagGroupsContent").empty();
	    $("#tagGroupsContent").addClass("accordion");
	    if(TSCORE.Config.Settings["tagGroups"].length < 1) {
            $("#tagGroupsContent").append($("<button>", { 
                "class": "btn",
                text: "Create New Taggroup"
            })
            .click( function(event) {
                TSCORE.showDialogTagGroupCreate();
            })            
            );	        
	        return true;
	    }
	    
	    for(var i=0; i < TSCORE.Config.Settings["tagGroups"].length; i++) {
	        $("#tagGroupsContent").append($("<div>", { 
	            "class": "accordion-group",    
                "style": "width: 99%; border: 0px #aaa solid;",	            
	        })
	        .append($("<div>", { 
	            "class":        "accordion-heading  btn-group",
	            "style":        "width:100%; margin: 0px;",
                "key":          TSCORE.Config.Settings["tagGroups"][i].key,	            
	        })
	        
            .append($("<button>", { // Taggroup toggle button
                        "class":        "btn btn-link tagGroupIcon",
                        "data-toggle":  "collapse",
                        "data-target":  "#tagButtons"+i,
                        "title":        "Toggle TagGroup",
                    }  
                )
                .html("<i class='icon-tags'></i>")   
            )// End taggroup toggle button  
                        	        
	        .append($("<button>", {
				"class":        "btn btn-link btn-small tagGroupTitle",
	            "text":         TSCORE.Config.Settings["tagGroups"][i].title, 
                "key":          TSCORE.Config.Settings["tagGroups"][i].key, 	      
	        })  
	        )
	        .droppable({
                accept: '.tagButton',
                hoverClass: "dirButtonActive",
                drop: function( event, ui ) {
                    var tagGroupData = TSCORE.Config.getTagData(ui.draggable.attr("tag"), ui.draggable.attr("parentKey"));
                    tagGroupData.parentKey = ui.draggable.attr("parentKey");
                    var targetTagGroupKey = $(this).attr("key");
                    console.log("Moving tag: "+tagGroupData.title+" to "+targetTagGroupKey);
                    TSCORE.Config.moveTag(tagGroupData, targetTagGroupKey);
                    generateTagGroups();
                    $(ui.helper).remove();
                }                   
            })  
	        
	        .append($("<button>", {
	                "class": "btn btn-link tagGroupActions",
	                "tag": TSCORE.Config.Settings["tagGroups"][i].title, 
	                "key": TSCORE.Config.Settings["tagGroups"][i].key, 
	                "title": "Taggroup options",
 	        })              
	        .dropdown( 'attach' , '#tagGroupMenu' )
	        .append("<b class='icon-ellipsis-vertical'></b>")
	        .click( function(event) {
	                //console.log("Clicked in taggroup setting");    
	                TSCORE.selectedTag = $(this).attr("tag");
	                TSCORE.selectedTagData = TSCORE.Config.getTagGroupData($(this).attr("key"));
	                TSCORE.selectedTagData.parentKey = undefined;  
	        })
	        ) // end gear
	        
	        ) // end heading
	        
	        .append($("<div>", { 
	            "class":   "accordion-body collapse in",
	            "id":      "tagButtons"+i,
	            "style":   "margin: 0px 0px 0px 3px; border: 0px;",
	        })	        
	        .append($("<div>", { 
	            "class":   "accordion-inner",
	            "id":      "tagButtonsContent"+i,
	            "style":   "padding: 2px; border: 0px;",
	        })
	        ) // end accordion-inner	
	        ) // end accordion button        

  	        ); // end group

	        var tagButtons = $("<div>").appendTo( "#tagButtonsContent"+i );  
	        for(var j=0; j < TSCORE.Config.Settings["tagGroups"][i]["children"].length; j++) {
	            tagButtons.append($("<a>", { 
	                "class":         "btn btn-small tagButton", 
	                "tag":           TSCORE.Config.Settings["tagGroups"][i]["children"][j].title, 
	                "parentKey":     TSCORE.Config.Settings["tagGroups"][i].key,
	                "title":         "Opens context menu for "+TSCORE.Config.Settings["tagGroups"][i]["children"][j].title,
	                "text":          TSCORE.Config.Settings["tagGroups"][i]["children"][j].title+" ",
	                "style":         generateTagStyle(TSCORE.Config.Settings["tagGroups"][i]["children"][j]), 
	            })            
	            .click( function() {
	                TSCORE.selectedTag = $(this).attr("tag");
	                TSCORE.selectedTagData = TSCORE.Config.getTagData($(this).attr("tag"), $(this).attr("parentKey"));
	                TSCORE.selectedTagData.parentKey = $(this).attr("parentKey");
	            })
                .draggable({
                    "appendTo":   "body",
                    "helper":     "clone",
                    "revert":     'invalid',
                }) 
                .append("<span class='caret'/>")
	            .dropdown( 'attach' , '#tagTreeMenu' )               
                );
	       } 
	    }
        // Activating nano scroller
        //$("#tagGroups").nanoScroller();	    
	}
		
	function openTagMenu(tagButton, tag, filePath) {
	    TSCORE.selectedFiles.push(filePath);
	    TSCORE.selectedTag = tag;
	}
	
	// Helper function generating tag buttons
	function generateTagButtons(commaSeparatedTags, fileName, filePath) {
	    //console.log("Creating tags...");
	    var tagString = ""+commaSeparatedTags;
	    var wrapper = $('<span>');
	    if(filePath == undefined) {
	    	filePath = TSCORE.currentPath+TSCORE.TagUtils.DIR_SEPARATOR+fileName;
	    }
	    if(tagString.length > 0) {
	        var tags = tagString.split(",");
	        for (var i=0; i < tags.length; i++) { 
	            wrapper.append($('<button>', {
	                title: "Opens context menu for "+tags[i],
	                tag: tags[i],
	                filename: fileName,
	            	filepath: filePath,                
	                "class":  "btn btn-small tagButton", 
	                text: tags[i]+" ",
	                style: generateTagStyle(TSCORE.Config.findTag(tags[i]))
	                })
	                .append("<span class='caret'/>")
                );   
	        }   
	    }
	    return wrapper.html();        
	}
	
	// Get the color for a tag
	function generateTagStyle(tagObject) {
        var tagStyle = "";
        if(tagObject.color != undefined) {
           var textColor = tagObject.textcolor;
           if(textColor == undefined) {
              textColor = "white"; 
           }
           tagStyle = "color: "+textColor+" !important; background-color: "+tagObject.color+" !important;"
        }
        return tagStyle;	    
	}
	
    // Helper function generating file extension button
    function generateExtButton(fileExtension, fileName, filePath) {
        //console.log("Creating ext button...");
        var wrapper = $('<span>');
        if(filePath == undefined) {
            filePath = TSCORE.currentPath+TSCORE.TagUtils.DIR_SEPARATOR+fileName;
        }
        if(fileExtension.length > 0) {
            wrapper.append($('<button>', {
                title: "Opens context menu for "+fileExtension,
                tag: fileExtension,
                filename: fileName,
                filepath: filePath,
                "class":  "btn btn-small extTagButton",                
                text: fileExtension+" "
                })
                .append("<span class='caret'/>")
                );          
        } 
        return wrapper.html();        
    }	

    function showDialogTagCreate() {
        $( "#newTagTitle" ).val("");         
        $( '#dialogTagCreate' ).modal({show: true});        
    }   

    function showDialogEditTagGroup() {
        $( "#tagGroupName" ).val(TSCORE.selectedTagData.title);              
        $( '#dialogEditTagGroup' ).modal({show: true});        
    }
    
    function showDialogTagGroupCreate() {
        $( "#newTagGroupName" ).val("");         
        $( '#dialogTagGroupCreate' ).modal({show: true});        
    }

    function showTagEditInTreeDialog() {
        $( "#tagInTreeName" ).val(TSCORE.selectedTagData.title);
        $( "#tagColor" ).simplecolorpicker({picker: true});    
        if(TSCORE.selectedTagData.color == undefined || TSCORE.selectedTagData.color.length < 1) {
            $( "#tagColor" ).simplecolorpicker('selectColor', '#008000');  
        } else {
            $( "#tagColor" ).simplecolorpicker('selectColor', TSCORE.selectedTagData.color);   
        }
        $( "#tagTextColor" ).simplecolorpicker({picker: true});        
        if(TSCORE.selectedTagData.textcolor == undefined || TSCORE.selectedTagData.textcolor.length < 1) {
            $( "#tagTextColor" ).simplecolorpicker('selectColor', '#ffffff');            
        } else {
            $( "#tagTextColor" ).simplecolorpicker('selectColor', TSCORE.selectedTagData.textcolor);            
        }
        $( '#dialogEditInTreeTag' ).modal({show: true});        
    }	

	function showAddTagsDialog() {
	    console.log("Adding tags..."); 
        function split( val ) {
            return val.split( /,\s*/ );
        }
        function extractLast( term ) {
            return split( term ).pop();
        }
        
        // TODO reactive comma separated autocomplete
        $( "#tags" ).typeahead( {
            "source":  TSCORE.Config.getAllTags()
        })            
/*        $( "#tags" )
        // don't navigate away from the field on tab when selecting an item
        .bind( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
                    $( this ).data( "autocomplete" ).menu.active ) {
                event.preventDefault();
            }
        })
        .autocomplete({
            minLength: 0,
            source: function( request, response ) {
                // delegate back to autocomplete, but extract the last term
                response( $.ui.autocomplete.filter(
                    TSCORE.Config.getAllTags(), extractLast( request.term ) ) );
            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function( event, ui ) {
                var terms = split( this.value );
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push( ui.item.value );
                // add placeholder to get the comma-and-space at the end
                terms.push( "" );
                this.value = terms.join( ", " );
                return false;
            }
        }); */

        $("#tags").val("");
        $( '#dialogAddTags' ).modal({show: true});
	}    

    // Public API definition
    exports.initContextMenus                 = initContextMenus;
    exports.initDialogs                      = initDialogs;
    exports.generateTagGroups                = generateTagGroups;
    exports.openTagMenu    				     = openTagMenu;
    exports.generateTagButtons               = generateTagButtons;
    exports.generateExtButton                = generateExtButton;
	exports.showAddTagsDialog				 = showAddTagsDialog;
	exports.showTagEditInTreeDialog          = showTagEditInTreeDialog;	
    exports.showDialogTagCreate              = showDialogTagCreate;
    exports.showDialogEditTagGroup           = showDialogEditTagGroup;
    exports.showDialogTagGroupCreate	     = showDialogTagGroupCreate;

});