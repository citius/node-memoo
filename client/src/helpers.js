(function ($) {
  window.helpers = {
    validators: {
      verify: function($element) {
        var $verifyWithInput = $('#' + $element.attr('data-verify-with'));
        return ($element.val() == $verifyWithInput.val());
      }
    }
  };
})(jQuery);
