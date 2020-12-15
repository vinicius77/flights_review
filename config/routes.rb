Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do 
    namespace :v1 do
      resources :airlines, param: :slug
      resources :reviews, :only [:create, :destroy]
    end  
  end

  # gets the new start path and route it to pages#index
  # It routes requests that aren't for existing paths predefined in the API
  # back to the index path.
  # When using React Router, allows rendering routing to React components without 
  # interfering with the actual routes for the API
  get '*path', to: 'pages#index', via: :all
end
