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
  attributes :name, :image_url, :slug

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

Creating the pages controller on <code>/controllers/pages_controller.rb</code> directory.

```ruby

class PagesController < ApplicationController
def index

    end
end

```

Creating the airlines controller on <code>/controllers/api/v1/airlines_controller.rb</code> directory.

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
				@options ||= { include: %i[reviews]}
			end

		end
  end
end
```
