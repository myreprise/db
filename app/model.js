// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Create a Project Schema. This is the basis for most important data model in the app
var ProjectSchema = new Schema({
    name: {type: String, required: true},
    ch_name: {type: String},
    developer: {type: String},
    city: {type: String, required: true},
    district: {type: String},
    location: {type: [Number], required: true}, // [Long, Lat]

    gfa: {type: Number},
    gla: {type: Number},
    nla: {type: Number},

    opening_year: {type: Number},
    purchase_price: {type: Number},
    acquisition_date: {type: Date},
    developer_interest: {type: Number},

    core_stats: {
        occupancy: {
            type: Number, date: Date
        },
        traffic: {
            type: Number, date: Date
        }
    },

    financials: {
        valuation: {
            type: Number, date: Date
        },
        gross_revenue: {
            type: Number, date: Date
        },
        net_revenue: {
            type: Number, date: Date
        },
        rental_income: {
            type: Number, date: Date
        },
        cap_rate: {
            type: Number, date: Date
        },
    },

    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}

});


//Set the created_at parameter equal to the current time
ProjectSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Index the schema in 2dsphere format (for proximity searches)
ProjectSchema.index({location: '2dsphere'});

// Export the ProjectSchema for use elsewhere. Sets the MongoDB collection as "db-projects"
module.exports = mongoose.model('db-projects', ProjectSchema);