import { useState } from "react";
import { WorldOfRR } from "../../../api/orderApis";

async function GetWorldOfRRContent(){
    await WorldOfRR()
}

