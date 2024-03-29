import React, { useEffect, useState } from 'react'
import { TailSpin } from "react-loader-spinner";
import creditImg from '../Images/credit.png'
import debitImg from '../Images/debit.png'
import './Dashboard.css'
import Barchart from '../PieChart/Barchart'
import Last3Transactions from './Last3Transactions'
import Header from '../Header/Header'
import NotFound from '../NotFound/NotFound';
import Sidebar from '../Sidebar/Sidebar';
import { FetchAPiCalls } from '../../APIServices/FetchApi';

import Cookies from 'js-cookie'

const Dashboard = (props) => {
    const [apiData,setApiData] = useState([])
    const [credit, setCredit] = useState(0)
    const [debit, setDebit] = useState(0)
    const [lastTransactions,setTransactions] = useState([])
    const [data,setData]= useState([])
    const [apiStatus,setApiStatus] = useState("LOADING")
    const [deletedTransId, setDeletedTransId] = useState("")

    const accessToken = parseInt(Cookies.get("access_token"))

const getTransactionsTotal = async()=>{
        const url  = "/api/rest/credit-debit-totals"
        const response = await FetchAPiCalls.fetchUserData(url,"GET")
        const data = await response.json()
        const amount = data.totals_credit_debit_transactions
        setDebit(amount[0]?.sum?amount[0].sum:0)
        setCredit(amount[1]?.sum?amount[1].sum:0)
        
    
}

const getLastTransactions = async() =>{
        const url  = "/api/rest/all-transactions?limit=3&offset=0"
        const response = await FetchAPiCalls.fetchUserData(url,"GET")
       
        if (response.ok){
            const data = await response.json()
            const transactions = data.transactions
       
            setTransactions(transactions)
            setApiStatus("SUCCESS")
        }
        else{
            setApiStatus("ERROR")
        }
        
}

const getLast7daysTransactions = async() =>{
    const url  = "/api/rest/daywise-totals-7-days"
        const response = await FetchAPiCalls.fetchUserData(url,"GET")
        const data = await response.json()
      
        // const transactions = data.transactions
        // setTransactions(transactions)
}

const getAdminTransactionsTotal = async()=>{
    const url  = "/api/rest/transaction-totals-admin"
    const response = await FetchAPiCalls.fetchAdminData(url)
   
    const data = await response.json()
    const amount = data.transaction_totals_admin
    setDebit(amount[0].sum)
    setCredit(amount[1].sum)
    

}
const geAdmintLastTransactions = async() =>{
    const url  = "/api/rest/all-transactions?limit=3&offset=0"
    const response = await FetchAPiCalls.fetchAdminData(url)
   
    if (response.ok){
        const data = await response.json()
        const transactions = data.transactions
        setTransactions(transactions)
        setApiStatus("SUCCESS")
    }
    else{
        setApiStatus("ERROR")
    }
    
}
const getAdminLast7daysTransactions = async() =>{
    const url  = "/api/rest/daywise-totals-7-days"
        const response = await FetchAPiCalls.fetchAdminData(url)
        const data = await response.json()
        // const transactions = data.transactions
        // setTransactions(transactions)
}



useEffect(()=>{
    if (accessToken===3){
        geAdmintLastTransactions()
        getAdminTransactionsTotal()
        getAdminLast7daysTransactions()
    }
   else{
    getLastTransactions()
    getTransactionsTotal()
    getLast7daysTransactions()
   }
   
},[deletedTransId])

const updateLast3Transactions = updatedData => {
    const updateNewData = updatedData.update_transactions_by_pk
    const newData = lastTransactions.map((eachTrans) => {
        if (eachTrans.id === updateNewData.id){
            return updateNewData
        }
        return eachTrans
    })
    let debit  = 0
    let credit = 0
    newData.map((trans)=>{
        if(trans.type==="debit"){
            debit += trans.amount
        }
        else credit += trans.amount
    })
    setTransactions(newData)
    setDebit(debit)
    setCredit(credit)
}

const handleDeleteTrans = (removedId) => {
    setDeletedTransId(removedId.id)
}

const renderLoadingView = () => (
    <div className="loader-container">
    <TailSpin type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
    )

  const renderDashBoardPage = () =>(
    <div className='dashboard-page'>
    <div className='dashboard-top'>
    <div className='dash-top-card'>
        <div className='top-credit-debit'>
            <h1 className='credit-amount'>${credit}</h1>
            <p className='credit'>Credit</p>
        </div>
        <div>
        <img src={creditImg}  alt="credit"/>
        </div>
    </div>

    <div className='dash-top-card'>
        <div className='top-credit-debit'>
            <h3 className='debit-amount'>${debit}</h3>
            <p className='credit'>Debit</p>
        </div>
       
        <img src={debitImg}  alt="debit"/>
    
    </div>
    </div>
    <div className='last-trans-section'>
    <p className='last-transaction'>Last Transaction</p>
    <div className='last-trans-card'>
    {lastTransactions.length>0?<Last3Transactions data = {lastTransactions} isUser={true} updateLast3Transactions={updateLast3Transactions} handleDeleteTrans = {handleDeleteTrans} />:<p>No Data Available</p>}
    </div>

    </div>
    <div className='dash-bottom-section'>
        <p className='last-transaction-2'>Debit & Credit Overview</p>
        <div className='bottom-trans-card'>
            <Barchart />
        </div>
    </div>
    </div>
  )

const getDashBoardPageData = () =>{
    switch(apiStatus){
        case "SUCCESS":
            return renderDashBoardPage()
        case "LOADING":
            return renderLoadingView()
        case "ERROR":
            return <NotFound text={"API Failed"}/>
    }
}

  return (
    <>
    <Sidebar />
   <div className='dashboard-header'>
    <Header header={"Accounts"} tabsOpen={false}/>
    <div className='dashboard'>
    
       {getDashBoardPageData()}
    
    </div>
    </div>
    </>
  )
}

export default Dashboard