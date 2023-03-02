import { regenaratingTokenApi } from "../api/service"
import { CartState } from "../context"
import {removeToken,storeToken} from "../Redux-manage/services/localStorageService"
 async function TokenManage() {
    const {setLike}=CartState()
    console.log("token manage")
    const data = {
      "refresh": localStorage.getItem('refresh_token')
    }
    await regenaratingTokenApi(data).then(r => {
      if (r.error) {

       
        removeToken()
        setLike([])
        console.log("token error ---------------")
        this.clearInterval()
        window.location.reload(false)
        
        
      }
      else {
        console.log("token succesfully ---------------")
        const token = {
          access: r.access,
          refresh: r.refresh
        }
        storeToken(token)
      }
    })
  }


  export {TokenManage}