module Api
	module V1
		class AirlinesController < ApplicationController
			before_action :set_entry, only: [:show, :edit, :update, :destroy]
			protect_from_forgery with: :null_session

			def index 
				@airlines = Airline.all
				render json: AirlineSerializer.new(@airlines, options).serialized_json
			end

			def show
				# the line below nos is made on the before_action
				# airline = Airline.find_by(slug: params[:slug])
				render json: AirlineSerializer.new(@airline, options).serialized_json
			end

			def create
				@airline = Airline.new(airline_params)
				if @airline.save
					render json: AirlineSerializer.new(@airline).serialized_json
				else
					render json: {error: @airline.errors.messages}, status: 422
				end
			end

			def update
				# the line below nos is made on the before_action
				# airline = Airline.find_by(slug: params[:slug])
				if @airline.update(airline_params)
					render json: AirlineSerializer.new(@airline, options).serialized_json
				else
					render json: {error: @airline.errors.messages}, status: 422
				end			
			end

			def destroy
				# the line below nos is made on the before_action
				# airline = Airline.find_by(slug: params[:slug])
				if @airline.destroy
					head :no_content
				else
					render json: {error: @airline.errors.messages}, status: 422
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

			# DRY concepts
			# Combinated with the before_action performs this search for all the controllers
			# included in the only: [:show, :edit, :update, :destroy] options
			def set_entry
				@airline = Airline.find_by(slug: params[:slug])
			end
		
		end
  end
end 