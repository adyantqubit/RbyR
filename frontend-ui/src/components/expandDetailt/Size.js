import React from 'react'
import './Size.css'

const Size = (props) => {


  const onChange=(value)=>{
  }
  return (
    <div class="rating-container">
    <div class="rating">
        <form class="rating-form">

         <label for={props.key1}>
            <input type="radio" name={props.key2} class="super-happy" id={props.key1} value="super-happy" onChange={e=>onChange(e.target.value)}/>
            <span class="span">S</span>
         </label>

          <label for={props.key1*44}>
            <input type="radio" name={props.key2} class="happy" id={props.key1*44} value="happy" onChange={e=>onChange(e.target.value)} />
            <span class="span">M</span>
          </label>

        

        <label for={props.key1*88}>
            <input type="radio" name={props.key2} class="sad" id={props.key1*88} value="sad" onChange={e=>onChange(e.target.value)}/>
            <span class="span">L</span>
        </label>

        <label for={props.key1*108}>
            <input type="radio" name={props.key2} class="super-sad" id={props.key1*108} value="super-sad" onChange={e=>onChange(e.target.value)}/>
            <span class="span">XL</span>
        </label>

        <label for={props.key1*126}>
            <input type="radio" name={props.key2} class="super-sad" id={props.key1*126} value="super-sad" onChange={e=>onChange(e.target.value)}/>
            <span class="span">XXL</span>
        </label>
      
        </form>
  </div>
</div>

  )
}

export default Size