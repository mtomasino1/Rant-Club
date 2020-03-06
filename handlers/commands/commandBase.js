class commandBase {
    constructor(models) {
        this.models = models
        this.helpText = ""
        this.descriptionText = ""
        this.name = ""
        this.allowDuringCooldown = false
    }

    help(){
        return this.helpText;
    }
    description(){
        return "**" + this.name + "** : " + this.descriptionText;
    }
    getAllowDuringCooldown(){
        return this.allowDuringCooldown;
    }

    async execute(user, msg, args){
        
    }
}

module.exports = commandBase;