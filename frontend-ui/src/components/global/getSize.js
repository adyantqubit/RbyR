//Commented by Rohan -17/12/22
//Reason -One Requirement raise, we have to show size in short from 
// so here we pass size and short form of size returns

export function SizeGetter(size){
    if(size=="Short")
    return "S";
    else if(size=="Medium")
    return "M";
    else if(size=="Large")
    return "L";
    else if(size=="Extra Large")
    return "XL";
    else if(size=="Extra Extra Large")
    return "XXL";
}

