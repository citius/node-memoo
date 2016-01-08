(function ($) {
  $(function () {
    $('#signupForm').validator({
      custom: helpers.validators,
      disable: false,
      errors: {
        verify: 'Пароли должны совпадать'
      }
    });
    
    $('#signinForm').validator({
      disable: false
    })
  });
})(jQuery);
