/**
 * Created by mc on 12/11/15.
 */

function Weasywyg(textareasClass)
{
    this.textarea = null;
    this.preview = null;
    this.overlay = null;
    this.commands = [
        "undo","redo", "bold", "italic", "underline", "strikeThrough", "createLink", "insertImage", "insertHtml", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent", "FontSize", "FontName", "foreColor", "backColor", "removeFormat"
    ]
}

Weasywyg.prototype.makeWYSIWYG =  function() {
    var self = this;
    console.log("Making WYSIWYG");
    var textareas = document.getElementsByTagName("textarea");
    console.log("Nombre de textareas : "+textareas.length);
    //injecting overlay
    self.drawViewer();

    for (var i=0; i<textareas.length;i++)
    {
        self.initTextarea(textareas[i], i)
    }
    return self;
};

Weasywyg.prototype.drawViewer = function() {
    var self = this;
    var overlay = hh.createElement("div",{
        id:[
            "weasywygOverlay"
        ]
    });
    overlay.addEventListener('click',self.stopEditMode);
    overlay.appendChild(self.makeCloser());
    overlay.appendChild(self.makeWriter());
    overlay.appendChild(self.makeToolbox());
    document.body.appendChild(overlay);
};

Weasywyg.prototype.makeToolbox = function() {
    var toolbox = hh.createElement("div",{
        id: "weasywygToolbox",
        innerHTML: '<span title="Code/Preview" class="view textarea-styler" onmousedown="event.preventDefault();" onclick="switchView()"></span>' +
        '<span title="Annuler" class="undo textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'undo\',false,null);"></span>' +
        '<span title="Rétablir" class="redo textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'redo\',false,null);"></span>' +
        '<span title="Gras" class="addBold textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'bold\',false,null);"></span>' +
        '<span title="Italique" class="addEm textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'italic\',false,null);"></span>' +
        '<span title="Souligné" class="addUnderline textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'underline\',false,null);"></span>' +
        '<span title="Barré" class="addStrikethrough textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'strikeThrough\',false,null);"></span>' +
        '<span title="Ajouter un lien hypertexte à la sélection" class="addLink textarea-styler"  onmousedown="event.preventDefault();" onclick="document.execCommand(\'createLink\',false,prompt(\'Saisissez une URL\'));"></span>' +
        '<span title="Insérer une image" class="addImage textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'insertImage\',false,prompt(\'Saisissez le lien vers votre image\'));"></span>' +
        '<span title="Insérer un média embeddable" class="addEmbed textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'insertHtml\',false,prompt(\'Saisissez le code HTML\'));"></span>' +
        '<span title="Aligner la sélection à gauche" class="alignLeft textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyLeft\',false,null);"></span>' +
        '<span title="Aligner la sélection au center" class="alignCenter textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyCenter\',false,null);"></span>' +
        '<span title="Aligner la sélection à droite" class="alignRight textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyRight\',false,null);"></span>' +
        '<span title="Justifier la sélection" class="alignJustify textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyFull\',false,null);"></span>' +
        '<span title="Indenter" class="indent textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'indent\',false,null);"></span>' +
        '<span title="Supprimer indentation" class="outdent textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'outdent\',false,null);"></span>' +
        '<span title="Taille de la police" class="select textarea-styler">' +
        '<select onChange="document.execCommand(\'FontSize\',false,this[this.selectedIndex].value);" id="textareaFontSize">' +
        '<OPTION VALUE="1" SELECTED>1</option>' +
        '<OPTION VALUE="2">2</OPTION>' +
        '<OPTION VALUE="3">3</OPTION>' +
        '<OPTION VALUE="4">4</OPTION>' +
        '<OPTION VALUE="5">5</OPTION>' +
        '<OPTION VALUE="6">6</OPTION>' +
        '<OPTION VALUE="7">7</OPTION>' +
        '</select>' +
        '</span>' +
        '<span title="Police" class="select police textarea-styler">' +
        '<select onchange="document.execCommand(\'FontName\',false,this[this.selectedIndex].value);">' +
        '<OPTION VALUE="Lato" SELECTED>Lato</option>' +
        '<OPTION VALUE="Arial">Arial</option>' +
        '<OPTION VALUE="Courier">Courier</OPTION>' +
        '<OPTION VALUE="Helvetica">Helvetica</OPTION>' +
        '<OPTION VALUE="Times New Roman">Times New Roman</OPTION>' +
        '</select>' +
        '</span>' +
        '<span title="Couleur du texte" class="textarea-styler" onmousedown="event.preventDefault();">' +
        '<input class="color" type="color" value="#ffffff" onchange="document.execCommand(\'foreColor\',false,this.value);">' +
        '</span>' +
        '<span title="Couleur du fond" class="textarea-styler" onmousedown="event.preventDefault();">' +
        '<input class="color" type="color" value="#000000" onchange="document.execCommand(\'backColor\',false,this.value);">' +
        '</span>' +
        '<span title="Effacer le formatage du texte" class="removeFormat textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'removeFormat\',false,null);"></span>' +
        '<span title="Attacher en haut" class="toolbarFixer textarea-styler" onclick="fixViewTop();"></span>'
    });
    toolbox.addEventListener("click",function(event){
        event.stopPropagation();
    });
    return toolbox;
};

Weasywyg.prototype.makeWriter = function() {
    var writerContainer = hh.createElement("div",{
        id: "weasywygWriterContainer",
        onclick: function(event){
            event.stopPropagation();
        }
    });
    var writer = hh.createElement("div",{
        id: "weasywygWriter",
        contentEditable: true
    });
    writerContainer.appendChild(writer);
    return writerContainer;
};

Weasywyg.prototype.makeCloser = function() {
    var self = this;
    var closer = hh.createElement("button",{
        id: "weasywygCloser",
        textContent: "✖"
    });
    closer.addEventListener('click',self.stopEditMode);
    return closer;
};





Weasywyg.prototype.initTextarea = function(element, index) {
    var self = this;
    console.log("Initialisation du textarea #"+index);
    element.addEventListener('click',self.startEditMode);
};

Weasywyg.prototype.startEditMode = function(event) {
    console.log("Edit mode ON");
    if (event !== undefined)
    {
        if (this.textarea !== event.target)
        {
            document.getElementById("weasywygWriter").innerHTML = event.target.value;
            this.textarea = event.target;
        }
        document.getElementById("weasywygOverlay").classList.add("visible");


    }

};

Weasywyg.prototype.stopEditMode = function(event) {
    console.log("Edit mode OFF");
    if (event !== undefined)
    {
        event.preventDefault();
        document.getElementById("weasywygOverlay").classList.remove("visible");

    }
};


var weasywyg = new Weasywyg().makeWYSIWYG();
