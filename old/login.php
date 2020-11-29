<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home</title>
    <link rel="stylesheet" href="https://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />
    <link rel="stylesheet" href="css/custom.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
</head>
<body>
  <div data-role="page">
  <div id="header" data-role="header">
    <h1>Property App - Login Page</h1>
    </div>
    <div id="content" data-role="content">
    <form> 
      <div id="loginForm">
      <h2> Enter your credentials to login</h2>
          <div id="usernameDiv" data-role="field-contain">
            <input type="text" name="username" placeholder="Username" id="username"/>
          </div><!--Username-->
          <div id="passwordDiv" data-role="field-contain">
            <input type="password" name="password" placeholder="Password" id="password"/>
          </div><!--Password-->
          <div id="loginButtonDiv" data-role="field-contain">
            <button name="login" type="submit" data-inline="true">Login</button>
          </div><!--button-->
      </div>
    </form>
    <div id="footer" data-role="footer">
      <h1>Copyright &copy; Jonathan Black 2020</h1>
    </div>

  </div>
  </div>

</body>
</html>