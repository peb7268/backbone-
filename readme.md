Project Name: Overview
====================================================================================================================
Description: A Basecamp Replacement for better CRM and Tech Team / Ops integration.

Steps:
---------------------------------------------------------------------------------------------------------------------

1. Wrap everything in a SIAF
2. Setup your namespace
3. Create your singular model and a collection to handle multiple models.
4. Create your singular view collection view to handle multiple views.
 
5. Create your collection instance and pass it a dataset (models), an array of objects.
6. Create your collection view instance and pass it the name of the collection from step 5.
7. Append your views to the body and call the render method and the el property of it.
 
Gotchas
---------------------------------------------------------------------------------------------------------------------
#### Always return this from your render method. This allows chaining.
#### When making your instances make your data structures (models) before your views


	(function(){
			window.Overview = {
			Models: {},
			Collections: {},
			Views: {},
			vars: {}
		};
	//Globals
	window.template = function(id){
		return _.template($('#' + id).html());
	};
	Overview.vars.body = document.querySelectorAll('body');
	Overview.vars.body[0].innerHTML = '<div id="content"></div>' + Overview.vars.body[0].innerHTML;


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
			return this;
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
		},
		deleteTask: function(){
			this.model.destroy();
		},
		remove: function(){
			this.$el.remove();
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

	//Add the collection to the body	
	$(document.body).prepend(peopleView.render().el);
	$("#Tasks").append(tasksView.render().el);
	})();