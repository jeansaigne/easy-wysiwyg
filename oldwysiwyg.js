/**
 * Created by JeanSaigne on 26/08/15.
 */


/*
* makeWYSIWYG transforme l'élément textarea sur lequel il est appelé en éditeur WYSIWIG, une barre d'outil et une balise div d'édition sur place sont injectées
* chaque bouton injectée utilise la fonction HTML5 execCommand associée à l'attribut contenteditable.
* Liste des boutons/actions:Annuler, Rétablir, Gras, Italique, Souligné, Barré, Insérer une image, Insérer HTML, alignement gauche, alignement centre, alignement droit, alignement justifié,indenter, dédenter, taille de police, famille de police, couleur de police, couleur de fond, effacer le formattage
* */
$.fn.makeWYSIWYG = function() {
    console.log("making wysiwig");
    var textarea =  $(this);
    textarea.hide();
    textarea.after('<div id="textareaPreview" contenteditable="true" style="background-color:#2E2E2E;border:1px groove #ff4455;">'+textarea.val()+'</div>');
    textarea.before(
    '<div id="textarea-toolbar">' +
        '<span title="Code/Preview" class="view textarea-styler" onmousedown="event.preventDefault();" onclick="switchView()"></span>' +
        '<span title="Annuler" class="undo textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'undo\',false,null);updateView();"></span>' +
        '<span title="Rétablir" class="redo textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'redo\',false,null);updateView();"></span>' +
        '<span title="Gras" class="addBold textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'bold\',false,null);updateView();"></span>' +
        '<span title="Italique" class="addEm textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'italic\',false,null);updateView();"></span>' +
        '<span title="Souligné" class="addUnderline textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'underline\',false,null);updateView();"></span>' +
        '<span title="Barré" class="addStrikethrough textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'strikeThrough\',false,null);updateView();"></span>' +
        '<span title="Ajouter un lien hypertexte à la sélection" class="addLink textarea-styler"  onmousedown="event.preventDefault();" onclick="document.execCommand(\'createLink\',false,prompt(\'Saisissez une URL\'));updateView();"></span>' +
        '<span title="Insérer une image" class="addImage textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'insertImage\',false,prompt(\'Saisissez le lien vers votre image\'));updateView();"></span>' +
        '<span title="Insérer un média embeddable" class="addEmbed textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'insertHtml\',false,prompt(\'Saisissez le code HTML\'));updateView();"></span>' +
        '<span title="Aligner la sélection à gauche" class="alignLeft textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyLeft\',false,null);updateView();"></span>' +
        '<span title="Aligner la sélection au center" class="alignCenter textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyCenter\',false,null);updateView();"></span>' +
        '<span title="Aligner la sélection à droite" class="alignRight textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyRight\',false,null);updateView();"></span>' +
        '<span title="Justifier la sélection" class="alignJustify textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'justifyFull\',false,null);updateView();"></span>' +
        '<span title="Indenter" class="indent textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'indent\',false,null);updateView();"></span>' +
        '<span title="Supprimer indentation" class="outdent textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'outdent\',false,null);updateView();"></span>' +
        '<span title="Taille de la police" class="select textarea-styler">' +
            '<select onChange="document.execCommand(\'FontSize\',false,this[this.selectedIndex].value);updateView();" id="textareaFontSize">' +
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
            '<select onchange="document.execCommand(\'FontName\',false,this[this.selectedIndex].value);updateView();">' +
                '<OPTION VALUE="Lato" SELECTED>Lato</option>' +
                '<OPTION VALUE="Arial">Arial</option>' +
                '<OPTION VALUE="Courier">Courier</OPTION>' +
                '<OPTION VALUE="Helvetica">Helvetica</OPTION>' +
                '<OPTION VALUE="Times New Roman">Times New Roman</OPTION>' +
            '</select>' +
        '</span>' +
        '<span title="Couleur du texte" class="textarea-styler" onmousedown="event.preventDefault();">' +
            '<input class="color" type="color" value="#ffffff" onchange="document.execCommand(\'foreColor\',false,this.value);updateView();">' +
        '</span>' +
        '<span title="Couleur du fond" class="textarea-styler" onmousedown="event.preventDefault();">' +
            '<input class="color" type="color" value="#000000" onchange="document.execCommand(\'backColor\',false,this.value);updateView();">' +
        '</span>' +
        '<span title="Effacer le formatage du texte" class="removeFormat textarea-styler" onmousedown="event.preventDefault();" onclick="document.execCommand(\'removeFormat\',false,null);updateView();"></span>' +
        '<span title="Attacher en haut" class="toolbarFixer textarea-styler" onclick="fixViewTop();"></span>' +
    '</div>');
    $('#textareaPreview').bind('keyup', function(){
        updateView();
    }).css('min-height','100px');
};

/*
* updateView est une fonction interne permettant de mettre à jour le contenu de la balise textarea d'origine selon selui de l'éditeur sur place
* */
function updateView() {
    $('#textareaPreview img').height(250);
    $('#textareaPreview').prev().val($('#textareaPreview').html());
}

/*
* switchView est un fonction qui permet de passer de la vue HTML brut à l'aperçu et vice-versa
* */
function switchView() {
    console.log("switchView");
    $('#textareaPreview').toggle();
    $('#textareaPreview').prev().toggle().val($('#textareaPreview').html());
}

/*
* fixViewTop est une fonction qui permet de fixer la barre d'outil.
* */
function fixViewTop() {
    $("#textarea-toolbar").toggleClass("fixedToolbar");
}