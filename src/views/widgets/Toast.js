class Toast{
    
    static TOAST_SUCCESS = {"backgroundColor":"green", "color":"white"};
    static TOAST_DANGER = {"backgroundColor":"red", "color":"white"};
    static TOAST_WARNING = {"backgroundColor":"orange", "color":"black"};
    static _activeToasts = [];

    static show(message,theme){
        const toast = document.createElement("div");
        toast.id = "toast-message";
        Object.keys(theme).map((item,index) => {
            toast.style[item] = theme[item];
        });
        toast.innerHTML = message;
        toast.style.opacity = 0;
        toast.style.transition = "all 0.5s";
        toast.style.opacity = 1;
        document.body.append(toast);
        let beforeHeight = toast.offsetHeight;        
        for(let i = 0 ; i < this._activeToasts.length; i++){
            this._activeToasts[i].style.bottom = (beforeHeight + 20) + "px";
            beforeHeight = this._activeToasts[i].offsetHeight + beforeHeight + 20;
        }
        this._activeToasts.unshift(toast);
        setTimeout(()=>{
            toast.style.opacity = 0;
            setTimeout(() => {
                toast.remove();
                this._activeToasts.pop();
            },500);
        },2000)
    }

}

module.exports = {Toast};