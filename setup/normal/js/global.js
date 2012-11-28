/** Project Name: Overview
*	Desc: A Basecamp Replacement
*
* Steps:
* 1) Wrap everything in a SIAF
* 2) Setup your namespace
* 3) Create your singular model and a collection to handle multiple models.
* 4) Create your singular view collection view to handle multiple views.
* 
* 5) Create your collection instance and pass it a dataset (models), an array of objects.
* 6) Create your collection view instance and pass it the name of the collection from step 5.
* 7) Append your views to the body and call the render method and the el property of it.
* 
* Gotchas --
* #Always return this from your render method. This allows chaining.
*
*/

//Namespace
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
	//Individual Task View
	Overview.Views.Task = Backbone.View.extend({
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
	//Tasks Collection View
	Overview.Views.Tasks = Backbone.View.extend({
		tagName: 'form',
			 id: 'Tasks',

		render: function(){
			this.collection.each(this.addOne, this);
			return this;
		},
		//task is a model
		addOne: function(task){
			//create a new child view
			var taskView = new Overview.Views.Task({ model: task });
			taskView.render();

			//Append to root element
			this.$el.append(taskView.render().el);
		}
	});

	//Add a new task view
	Overview.Views.AddTask = Backbone.View.extend({
		el: '#addTask',

		events: {
			'submit': 'submit'

		},
		submit: function(e){
			e.preventDefault();
			var newTaskTitle = $(e.currentTarget).find('input[type="text"]').val();
			var task = new Overview.Models.Task({ title: newTaskTitle });
			this.collection.add(task);
		},
		initialize: function(){

		}

	});

	//Implementation: Instances - Collection / CollecitonView
	var people = new Overview.Collections.People(roledex),
		peopleView = new Overview.Views.People({ collection: people });
	
	var tasks = new Overview.Collections.Tasks([
		{
			title: 'Go to store',
			priority: 4
		},
		{
			title: 'Get Todo App Built',
			priority: 4
		},
		{
			title: 'Study Backbone Tuts',
			priority: 4
		}
	]);
	var tasksView = new Overview.Views.Tasks({ collection: tasks });

	/** Stopped video for creating new tasks at 5:50 ******************************************/
	//var addTasksView = new Overview.Views.AddTask({ collection: Tasks });

	//Add the collection to the body	
	$(document.body).prepend(peopleView.render().el);
	$("#content").append(tasksView.render().el);

})();