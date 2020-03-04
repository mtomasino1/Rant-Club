class commandBase {
    constructor(models) {
        this.models = models
        this.helpText = ""
        this.descriptionText = ""
        this.name = ""
    }

    help(){
        return this.helpText;
    }
    description(){
        return "**" + this.name + "** : " + this.descriptionText;
    }

    async execute(user, msg, args){
        
    }
}

module.exports = commandBase;