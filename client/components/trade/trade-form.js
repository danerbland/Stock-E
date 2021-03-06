import React from 'react'
import {connect} from 'react-redux'

import {postOrderThunkCreator} from '../../store/orders'

class DisconnectedTradeForm extends React.Component{

  constructor(props){
    super()
    this.state = {
      type: 'buy',
      quantity: 0,
    }
    this.handleChange = this.handleChange.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }


  //We'll get the single-company from state and create a simple form.
  //The data we send will need to look like:
  /*
  {
    type: type
    quatity: quantity
    companyId: companyId
  }
  */

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  submitHandler = (event) => {
    event.preventDefault()
    const data = {
      type: this.state.type,
      quantity: this.state.quantity,
      companyId: this.props.company.companyId
    }
    try {
      this.props.postOrder(data)
    } catch (error) {
      console.error(error)
    }
  }

  render(){
    const {symbol, companyName, primaryExchange, latestPrice, change, changePercent, volume} = this.props.company

    //create an error message for front end validation.
    let errorMessage = ''

    if(this.state.type === "buy" && this.props.user.cash < (this.state.quantity * latestPrice * 100)){
      errorMessage = "You don't have enough cash to cover this!"
    } else if(this.state.type === 'sell'){
      let amtOwned = this.props.portfolio.reduce((accumulator, company) => {
        if(company.ticker === symbol){
          return accumulator + company.portfolioCompany.quantity
        } else{
          return accumulator
        }
      }, 0)

      if(!amtOwned){
        errorMessage = "You don't own this company!"
      } else if(amtOwned < this.state.quantity){
        errorMessage = "You don't own this many shares!"
      }
    }//endif

    const isSubmittable = errorMessage.length ? false : true;


    return(
      <div id='trade-form-container'>
        <h1>{symbol}</h1>
        <h2>{companyName}</h2>
        <div className='pli-info'>
        <p className='pli-attribute'>Exchange: <br/>{primaryExchange}</p>
        <p className='pli-attribute'>Price: <br/>${latestPrice}</p>
        <p className='pli-attribute'>Day Change: <br/>${change} <br/> {changePercent}%</p>
        <p className='pli-attribute'>Volume: <br/>{volume}</p>
        </div>
        <br/>
        <div className = 'divider'></div>
        <form id='trade-form' onSubmit={this.submitHandler}>
          <label htmlFor="Buy-Sell">Buy or Sell: </label>
            <select id='tf-select' name ="type" onChange={this.handleChange} value={this.state.type}>
              <option value="buy"  selected>
                Buy
              </option>
              <option value="sell">
                Sell
              </option>
            </select>
          <label htmlFor='quantity'>Shares</label>
          <input id='tf-shares' name='quantity' type='number' min='1' onChange={this.handleChange} value={this.state.quantity}></input>
          <p className='error-message'>{errorMessage}</p>
          <button id = 'tf-order-button' type='submit' disabled={!isSubmittable}>Order</button>
        </form>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  company: state.singleCompany,
  portfolio: state.portfolio,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  postOrder: (data) => dispatch(postOrderThunkCreator(data))
})

const TradeForm = connect(mapStateToProps, mapDispatchToProps)(DisconnectedTradeForm)

export default TradeForm
