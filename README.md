# Open Flights README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

## Installing Ruby

The recommended version for this project is Ruby 2.7.2

```
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install git-core zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev nodejs yarn
```

## Installing Rbenv

```
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install --verbose 2.7.2
rbenv global 2.7.2
ruby -v
```

## Installing bundler

```
gem install bundler
```

## Installing Ruby

The recommended version for this project is Rails 6.0.3.4

```
gem install rails -v 6.0.3.4
```

Making Rails executable with <code>rbenv</code>

```
rbenv rehash
```

## Setting Up [Postgresql](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-ruby-on-rails-application-on-ubuntu-18-04)

```
sudo apt install postgresql postgresql-contrib libpq-dev
```

Creating a user with permission to create databases:

```
sudo -u postgres createuser kako77sub -s

# If you want to set a password for the user, you can do the following
sudo -u postgres psql
postgres= # \password kako77sub

# Enter new password:
# Enter it again:

postgres=# \q
```

Script that created this project:

```
rails new open-flights --webpack=react --database=postgresql -T
```

Creating the database:

```
rails db:create
```

## Creating Models (Airline and Review)

Airline Model:

```
rails generate model Airline name:string image_url:string slug:string
```

Review Model:

```
rails generate model Review title:string description:string score:integer airline:belongs_to
```

The models are created on <code>/app/models/airline.rb</code> and <code>/app/models/review.rb</code>.

An also are created their respective migrations on <code>/db/migrate</code> directory.

**CreateReviews** migration example:

```ruby
class CreateReviews < ActiveRecord::Migration[6.0]
  def change
    create_table :reviews do |t|
      t.string :title
      t.string :description
      t.integer :score
      t.belongs_to :airline, null: false, foreign_key: true

      t.timestamps
    end
  end
end
```

## Creating a new schema from the migrations

```
rails db:migrate
```

The schema is created inside of the <code>/db/migrate/schema.rb</code> file.

## Setting the airline.rb model

```ruby
class Airline < ApplicationRecord
    has_many :reviews

    before_create :slugify
    before_update :slugify
    #This function Slugifies the airline name and sets is to the slugify field before setting
    #it on the database.

    #slugifying == "Qantas Airlines".parameterize => qantas-airlines.
    def slugify
        self.slug = name.parameterize
    end

    def average_score
        return 0 unless reviews.count.positive?
        reviews.average(:score).round(2).to_f
    end

end

```

## Populating the <code>/db/seed.rb</code> file in order to insert mock data in the database

```ruby
airlines = Airline.create([
    {
      name: "United Airlines",
      image_url: "https://open-flights.s3.amazonaws.com/United-Airlines.png"
    },
    {
      name: "Southwest",
      image_url: "https://open-flights.s3.amazonaws.com/Southwest-Airlines.png"
    },
    {
      name: "Delta",
      image_url: "https://open-flights.s3.amazonaws.com/Delta.png"
    },
    {
      name: "Alaska Airlines",
      image_url: "https://open-flights.s3.amazonaws.com/Alaska-Airlines.png"
    },
    {
      name: "JetBlue",
      image_url: "https://open-flights.s3.amazonaws.com/JetBlue.png"
    },
    {
      name: "American Airlines",
      image_url: "https://open-flights.s3.amazonaws.com/American-Airlines.png"
    }
  ])

  reviews = Review.create([
    {
        title: "Great Airline",
        description: "Such a Nice Time",
        score: 5,
        airline: airlines.first
    },
    {
        title: "Average Experience",
        description: "Nothing special. Just normal.",
        score: 3,
        airline: airlines.first
    },
    {
        title: "Awful experience",
        description: "Bad times I could say",
        score: 1,
        airline: airlines.first
    }
])
```

```
rails db:seed
```

You can check if the data was inserted successfuly on the database using the rails console.

```
rails console

Airline.first
Airline.count

Review.count

airline = Airline.first
airline.slug
airline.reviews
airline.reviews.count
airline.average_score

```

## Building out the API

Add this line to the application's <code>Gemfile</code>:

```
gem 'fast_jsonapi'
```

and installs the gem in the project

```
bundle install
```

This gem allows us creating serializers where we pass the specific attributes
we want to expose in the API as shown below.

```
rails generate serializer Airline name image_url slug
```

The <code>/app/serializers/airline_serializer.rb</code> will be similiar to it:

```ruby
class AirlineSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :image_url, :slug, :average_score

  # same as on Airline model
  has_many :reviews
end

```

We do the same for Reviews

```
rails generate serializer Review title description score airline_id
```

Checking the serializer
(\* if facing <code>Rails: NameError (uninitialized constant AirlineSerializer)) </code>

```
# Exit the rails console, if you're still inside it:
exit
spring stop
rails console
```

```
airline = Airline.first
AirlineSerializer.new(airline).serialized_json
AirlineSerializer.new(airline).as_json
```

## Routing

<code>/config/routes.rb</code>

```ruby
Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      resources :airlines, param: :slug
      resources :reviews, :only [:create, :destroy]
    end
  end

  get '*path', to: 'pages#index', via: :all
end
```

## Controllers

Creating the pages controller on <code>app/controllers/pages_controller.rb</code> directory.

```ruby
class PagesController < ApplicationController
  def index

  end
end
```

### Creating the airlines controller on <code>app/controllers/api/v1/airlines_controller.rb</code> directory.

```ruby
module Api
  module V1
		class AirlinesController < ApplicationController

			def index
				airlines = Airline.all
				render json: AirlineSerializer.new(airlines, options).serialized_json
			end

			def show
				airline = Airline.find_by(slug: params[:slug])
				render json: AirlineSerializer.new(airline, options).serialized_json
			end

			def create
				airline = Airline.new(airline_params)
				if airline.save
					render json: AirlineSerializer.new(airline).serialized_json
				else
					render json: {error: airline.errors.message}, status: 422
				end
			end

			def update
				airline = Airline.find_by(slug: params[:slug])
				if airline.update(airline_params)
					render json: AirlineSerializer.new(airline, options).serialized_json
				else
					render json: {error: airline.errors.message}, status: 422
				end
			end

			def destroy
				airline = Airline.find_by(slug: params[:slug])
				if airline.destroy
					head :no_content
				else
					render json: {error: airline.errors.message}, status: 422
				end
			end

			private
			def airline_params
				params.require(:airline).permit(:name, :image_url)
			end

			def options
        # @options is an instance variable and is available to all methods within the class.
        # %i[ ] Non-interpolated Array of symbols, separated by whitespace
        # %I[ ] Interpolated Array of symbols, separated by whitespace
        # %i[ test ]
        # => [:test]
        # str = "other"
        # %I[ test_#{str} ]
        # => [:test_other]
				@options ||= { include: %i[reviews]}
			end

		end
  end
end
```

### Creating the reviews controller on <code>app/controllers/api/v1/reviews_controller.rb</code> directory.

```ruby
module Api
	module V1
		class ReviewsController < ApplicationController

			def create
				review = Review.new(review_params)

				if review.save
					render json: ReviewSerializer.new(review).serialized_json
				else
					render json: { error: review.errors.messages }. status: 422
			end

			def destroy
				# The find method is usually used to retrieve a row by ID:
				# The find_by is used as a helper when you're searching for information within a column
				review = Review.find(params[:id])

        if review.destroy
        # head :no_content seems to create a HTTP response 200 (success) with an empty body,
        # returning this response header
					head :no_content
				else
					render json: { error: review.errors.messages }, status: 422
				end
			end

			private
			def review_params
				params.require(:review).permit(:title, :description, :score, :airline_id)
			end
		end
	end
end
```

## Making API Calls

To check all the routes from the application:

```
rails routes
```

(I have got some errors so this is how I solved them)

```
# warning Integrity check: System parameters don't match
# error Integrity check failed
# error Found 1 errors.


#========================================
#  Your Yarn packages are out of date!
#  Please run `yarn install --check-files` to update.
#========================================

yarn install --check-files
```

Starting the server

```
rails server
```

### Creating the API request files inside of `requests` directory

Create the `get_all_airlines.rest`

```
GET http://localhost:3000/api/v1/airlines
Content-type: application/json
```

Create the `get_airline.rest` (It uses the slug as a parameter)

```
GET http://localhost:3000/api/v1/airlines/american-airlines
Content-type: application/json
```

Create the `create_airline.rest`

```
POST http://localhost:3000/api/v1/airlines
Content-type: application/json

{
    "name": "Vinicius Airlines",
    "image_url": "https://open-flights.s3.amazonaws.com/Avianca.png"
}
```

This Post request will throw the error `ActionController::InvalidAuthenticityToken (ActionController::InvalidAuthenticityToken):` since Rails doesn't allow sending Post request to the controllers without a valid certification token, given its built-in default protection.

As a temporary fixing we should include `protect_from_forgery with: :null_session` in both the `app/controllers/api/v1/airlines_controller.rb` and `app/controllers/api/v1/reviews_controller.rb` files as following:

```ruby
module Api
  module V1
    class AirlinesController < ApplicationController
      protect_from_forgery with: :null_session

      # ...
```

```ruby
module Api
  module V1
    class ReviewsController < ApplicationController
      protect_from_forgery with: :null_session

      # ...
```

Create the `create_review.rest`

```
POST http://localhost:3000/api/v1/reviews
Content-type: application/json

{
    "title": "The flight was pretty good!",
    "description": "Happy with my trip in general",
    "score": 4,
    "airline_id": 1
}
```

## React (Frontend Initial Settings)

React and Webpack were already set when creating the project (see line :83) and the Javascript is placed on `app/javascript/packs...` directory.

In order to set React as the view layer of the application is necessary to add the **Javascript pack tag** into the views.

In `app/views/layouts/` directory, it is create new folder `pages` and a file `index.html.erb`. It refers the root path created previously on line 293 (<code>root 'pages#index'</code>).

So, our file on `app/views/layouts/pages/index.html.erb` will be as following:

```ruby
  <%= javascript_pack_tag 'hello_react' %>
```

Now if we run the command `rails server` in the terminal, we should see the React component rendering on `http://localhost:3000/`.

Just for sake of best practices we will rename the `hello_react.jsx` file from `app/javascript/packs/` to `index.jsx` and also update the Java script tag to `<%= javascript_pack_tag 'index' %>`

### Creating the Components

Under the `app/javascript/` directory, we will create the `components` folder and the `App.jsx` component that will hold the following content initially:

```javascript
import React from 'react';

const App = () => {
  return <div>App JS Component</div>;
};

export default App;
```

And also import our component and cleaning up the `index.jsx` to look like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App.jsx';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div'))
  );
});
```

### Defining a set of navigation components and establising routes using React Routes

Run the code on the terminal `yarn add react-router-dom`.

Now we adapt the `App` component to use React Routes and also create both `ViewAirline` and `Airlines` components, responsible to render an individual airline and all airlines respectively.

The `App.jsx`:

```javascript
import React from 'react';
import Airlines from '../components/Airlines.jsx';
import ViewAirline from '../components/ViewAirline.jsx';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Airlines} />
          <Route exact path="/airlines/:slug" component={ViewAirline} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
```

The initial content of `ViewAirline.jsx` component, responsible for render an individual airline:
**Note:** Don't confuse this component with the `Airline.jsx` we will create later. `ViewAirline.jsx` makes an API call to the backend in order to render an individual airlines and the `Airline.jsx` only renders the state already fetched from the `Airlines.jsx` parent component.

```javascript
import React from 'react';

const ViewAirline = () => {
  return <div>Individual Airline</div>;
};

export default ViewAirline;
```

The initial content of `Airlines.jsx` component, responsible for render all airlines:

```javascript
import React from 'react';

const Airlines = () => {
  return <div>ALL Airlines</div>;
};

export default Airlines;
```

### Airlines Component

In order to make API calls to the backend we will use the `axios` library.

```
yarn add axios
```

Now the `Airlines` component should look like this:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Airlines = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    airlines: null,
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const cancelToken = source.token;
    setState({
      loading: true,
      error: null,
      airlines: null,
    });
    axios
      .get('/api/v1/airlines/', {
        cancelToken,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        console.log(response.data.data);
        setState({
          loading: false,
          error: null,
          airlines: response.data.data,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          setState({
            loading: false,
            error: error.message,
            airlines: null,
          });
        }
      });

    return () => source.cancel();
  }, [setState]);

  if (state.loading) {
    return <div>Loading</div>;
  }

  if (state.error) {
    return <div>{error} :(</div>;
  }

  if (!state.airlines && !state.loading) {
    return <div>No Airlines Available</div>;
  }

  return (
    <div>
      <h1>Airlines Rate</h1>
      <h2>All the airline reviews in just one place</h2>
      {state.airlines && (
        <ul>
          {state.airlines.map((airline) => (
            <li key={airline.attributes.name}>{airline.attributes.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Airlines;
```

In short, inside of the `useEffect` before making the `GET` request, we set our `state` to `loading: true`. When GET request is made it returns a Promise where either the `useState` sets the new state of the application into the `airlines` key if successfuly or the error if failed.

### Preparing the Airline Component to render individual airlines

This Component will receive data as props from the parent component (`Airlines.jsx`) and render each airline individually.

```javascript
import React from 'react';
import { NavLink } from 'react-router-dom';

const Airline = ({ attributes }) => {
  return (
    <div>
      <img src={attributes.image_url} alt={attributes.name} />
      <p>Name: {attributes.name}</p>
      <p>Score: {attributes.average_score}</p>
      <NavLink to={`/airlines/${attributes.slug}`}>View Airline</NavLink>
    </div>
  );
};

export default Airline;
```

Importing and using the `Airline` component in the `Airlines.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Airline from '../components/Airline';

const Airlines = () => {
  // ...

  return (
    // ...
    {state.airlines && (
        <ul>
          {state.airlines.map((airline) => (
            <li key={airline.attributes.name}>
              <Airline attributes={airline.attributes} />
            </li>
          ))}
        </ul>
      )}
  )

  //...
}
```

### Disabling `turbolinks` in the application

The turbolinks tags cause a stranger behaviour when listenning the click in the "back arrow" on the browser. As a workaround, remove all the `'data-turbolinks-track': 'reload'` tags from:

The `app/views/layouts/application.html.erb` should be like this:

```ruby
<!DOCTYPE html>
<html>
  <head>
    <title>OpenFlights</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag 'application', media: 'all' %>
    <%= javascript_pack_tag 'application' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

Also remove (or comment) both the import `require("turbolinks").start()` in the `app/javascript/packs/application.js` file ...

```javascript
require('@rails/ujs').start();
// require("turbolinks").start()
require('@rails/activestorage').start();
require('channels');
```

... and the `gem "turbolinks"` on the `/Gemfile` file.

```ruby
# ...
gem 'webpacker', '~> 4.0'
# gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.7'
#...
```

To apply the changes, kill the server, re install the dependencies and restart the server.

```
CTRL + C
bundle install
rails server
```

If wish, in a separated terminal (at project root folder ofc), start the `webpack-dev-server`:

```
./bin/webpack-dev-server
```

## Fast Styling The Airline views

Not going into details in this part but the CSS file that holds all the source code is place at `app/javascript/components/App.css` and it is imported in the `App.jsx` file. Also extra some HTML elements, for example divs, are added in the components to follow the styling.
