import { regenaratingTokenApi } from "../api/service"
import { CartState } from "../context"
import {removeToken,storeToken} from "../Redux-manage/services/localStorageService"
 async function TokenManage() {
    const {setLike}=CartState()
    const data = {
      "refresh": localStorage.getItem('refresh_token')
    }
    await regenaratingTokenApi(data).then(r => {
      if (r.error) {

       
        removeToken()
        setLike([])
        this.clearInterval()
        window.location.reload(false)
        
        
      }
      else {
        const token = {
          access: r.access,
          refresh: r.refresh
        }
        storeToken(token)
      }
    })
  }


  export {TokenManage}