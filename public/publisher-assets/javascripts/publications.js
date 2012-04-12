// Javascript that may be used on every publication show/edit page

$(function () {
  $('.publication-nav').tabs();

  /*
    Pre-submit a form, invoking a callback if the submission succeeds.

    This is mainly used for the action buttons other than "Save", where it
    makes sense to save the edition and perform the requested action if there
    aren't any errors.
  */
  var submit_form = function(form,success) {
     var jq = $.post(
         form.attr('action')+".json",
         form.serialize(),
         success
     ).error( function(data) {
         var errors = $.parseJSON(data.responseText);
         var messages = "There were problems saving this edition: ";
         errors = $.map(errors, function(v,k) {
             return k + " " + v.join(", ");
         });
         messages = messages + errors.join("; ") + ".";
         $("<p class=\"flash-alert\">"+messages+"</p>").insertBefore("#wrapper:first");
     });
   }

  /* Apparently a lock variable to prevent multiple form submissions */
  var saved = false;

  $('#save-edition').submit(function () {
      var edition_form = $('form.whole_edition');
      if (! saved) {
          saved = true;
          edition_form.trigger('submit');
      }

      return false;
  });

  if (! 'autofocus' in document.createElement('input')) {
    $('*[autofocus]').focus();
  }

  /* Apparently a lock variable to prevent multiple form submissions */
  var submitted_forms = false;
  
  /*
    Mark the edition form as dirty to prevent accidental navigation away from
    the edition form (such as by clicking the "Edit in Panopticon" link)
  */
  var edition_form_dirty = false;

  $('form.whole_edition').change(function () {
    submitted_forms = false;
    edition_form_dirty = true;
  });

  $('form.whole_edition').submit(function() {
    edition_form_dirty = false;
    return true;
  });
  
  $(window).bind('beforeunload', function() {
      if (edition_form_dirty) {
          return 'You have unsaved changes to this edition.';
      }
  });

  $('.also_save_edition').submit(function () {
    var edition_form = $('form.whole_edition');
    var this_form = $(this);

    if (! submitted_forms) {
      submit_form(edition_form, function () {
        submitted_forms = true;
        /*
          Need to clear the dirty flag manually, as the form hasn't officially
          been submitted
        */
        edition_form_dirty = false;
        this_form.trigger("submit");
      });
    }

    return submitted_forms;
  });

  $('.cancel_button').click(function () {
    $(this).closest('form').dialog( "close" );
    return false;
  });

  $(".review_button, .progress_button").submit(function () {
    var activity = this.id.replace('_toggle', '_form');
    $('#' + activity).dialog({
      modal: true,
      width: 600
    });
    return false;
  });
});

function close_popups() {
   var iframe = document.getElementById('popup');
   iframe.parentNode.removeChild(iframe);
}
