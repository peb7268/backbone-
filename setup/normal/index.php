<!DOCTYPE html>

<!--[if lt IE 7]>      <html class="ie6"> <![endif]-->
<!--[if IE 7]>         <html class="ie7"> <![endif]-->
<!--[if IE 8]>         <html class="ie8"> <![endif]-->
<!--[if gt IE 8]><!--> <html>         <!--<![endif]-->

<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>Backbone | Templating and Structured JS</title>
	<link rel="stylesheet" href="styles.css" type="text/css" media="screen" title="no title" charset="utf-8">

</head>
<body>

	<form id="addTask" action="">
		<input type="text" placeholder="New Task...">
		<input type="submit" value="Add Task" class="defaultButton">
	</form>

	<script id="personTemplate" type="text/template">
		<strong><%= first_name %> <%= last_name %></strong> is a: <%= occupation %>
	</script>

	<script id="tasksTemplate" type="text/template">
			<input name="<%= title %>" type="checkbox" class="taskCheck">
			<input name="<%= title %>" value="<%= title %>" type="text" class="task"> is a: 
			<input name="<%= title %>Priority"<%= priority %> value="<%= priority %>" type="text" class="priority">priority.
			<span class="clear"><a href="#" class="update">Update</a><a href="#" class="delete">Delete</a></span>
	</script>

	<script type="text/javascript" src="js/underscore.js"></script>
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/backbone.js"></script>
	<script type="text/javascript" src="js/data.js"></script>
	<script type="text/javascript" src="js/global.js" charset="utf-8"></script>
</body>
</html>