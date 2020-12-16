module Api
	module V1
		class ReviewsController < ApplicationController
      protect_from_forgery with: :null_session

			def create
				review = Review.new(review_params)

				if review.save
					render json: ReviewSerializer.new(review).serialized_json
				else
					render json: { error: review.errors.messages }, status: 422
				end
			end

			def destroy
				# The find method is usually used to retrieve a row by ID:
				# The find_by is used as a helper when you're searching for information within a column
				review = Review.find(params[:id])

				if review.destroy
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
