(function(){
	window.Overview = {
		Models: {},
		Collections: {},
		Views: {},
		vars: {},
		Router: {}
	};
	//Globals
	window.template = function(id){
		return _.template($('#' + id).html());
	};
	Overview.vars.body = document.querySelectorAll('body');
	Overview.vars.body[0].innerHTML = '<div id="content"></div>' + Overview.vars.body[0].innerHTML;
	
	//Routers
	Overview.Router = Backbone.Router.extend({
		routes: {
			'': 'index',
		'today':'showTasks'
		},

		//Routes / Actions 
		index: function(){
			console.log('index action firing');
		},
		showTasks: function(){
			console.log('im showing the tasks for today');
		}
	});

	//People Definitions
	Overview.Models.Person = Backbone.Model.extend({
		defaults: {
			first_name: 'John',
			last_name: 'Smith',
			name: '',
			occupation: 'Web Guy',
			phone_number: '678-617-5386'
		},
		fullName: function(){
			return this.get('first_name') + ' ' + this.get('last_name');
		}
	}); 

	//Collection of People
	Overview.Collections.People = Backbone.Collection.extend({
		model: Overview.Models.Person
	});

	Overview.Views.Person = Backbone.View.extend({
		tagName: 'li',
		template: template('personTemplate'),

		render: function(){
			//console.log('I take the template and put the data into it.');
			this.$el.html(this.template(this.model.toJSON()));
			return this;	//If you omit this it will not chain and continue after it creates each person view
		}	
	}); 

	//View for all People (Collection View)
	Overview.Views.People = Backbone.View.extend({
		tagName: 'ul',
		id: 'People',

		render: function(){
			//Filter through all items in a collection
			this.collection.each(function(personModel){
			
				//Foreach create a new person view 	
				var person = new Overview.Views.Person({ model: personModel });

				//Append to the root element
				this.$el.append(person.render().el);
		}, this);

			//Add the final result to the body
			//$($('#content')).append(this.el);
			return this;
		}
	});

	//Tasks Definitions
	Overview.Models.Task = Backbone.Model.extend({});
	Overview.Collections.Tasks = Backbone.Collection.extend({ model: Overview.Models.Task });
	Overview.Views.Task = Backbone.View.extend({
		defaults: {
			title: 'New Task..',
			priority: ''
		},
		tagName: 'p',
		template: template('tasksTemplate'),

		initialize: function(){
			//Bind all events here. Initiating the pub / sub model
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},
		events: {
			'click .update ': 'updateTask',
			'click .delete ': 'deleteTask'
		},
		updateTask: function(){
			var newTask = this.$el.find('input.task').val();
			this.model.set('title', newTask);
			console.log('The model has been changed to: ',this.model.get('title'));
		},
		deleteTask: function(){
			this.model.destroy();
			console.log('the element has been deleted');
		},
		remove: function(){
			this.$el.remove();
			console.log('The element has been removed');
		},
		render: function(){
			this.$el.html( this.template(this.model.toJSON()));
			return this;
		}
	});

	Overview.Views.Tasks = Backbone.View.extend({
		tagName: 'form',
			 id: 'TasksView',

		initialize: function(){
			this.collection.on('add', this.addOne, this);
		},
		render: function(){
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function(task){	
			//create a new child view
			var taskView = new Overview.Views.Task({ model: task });

			//Append to root element
			this.$el.append(taskView.render().el);
		}
	});

	Overview.Views.AddTask = Backbone.View.extend({
		el: '#addTask',		//Uses an existing view element rather than making one

		events: {
			'submit': 'submit'

		},

		submit: function(e){
			e.preventDefault();
			var newTaskTitle = $(e.currentTarget).find('input[type="text"]').val();
			var task = new Overview.Models.Task({ 
				priority: 1,
				title: newTaskTitle
			});
			this.collection.add(task);
		},

		initialize: function(){}
	});

		
	//Instances
	var people = new Overview.Collections.People(roledex);								//People Collection
	var tasks = new Overview.Collections.Tasks(tasksModel);								//tasks Collection
	
	var	peopleView = new Overview.Views.People({ collection: people });					//People View
	var tasksView = new Overview.Views.Tasks({ collection: tasks });					//tasks Collection View
	var addTasksView = new Overview.Views.AddTask({ collection: tasks });				//addTasks Collection View

	new Overview.Router;																//Create a new Router Instance
	Backbone.history.start();															//Tell Backbone to Start tracking URL hash changes
	

	//Add the collection to the body	
	$(document.body).prepend(peopleView.render().el);
	$("#Tasks").append(tasksView.render().el);

})();