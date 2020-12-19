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
