import React, { useEffect, useState } from 'react'
import creditImg from '../Images/credit.png'
import debitImg from '../Images/debit.png'
import './Dashboard.css'
import Barchart from '../PieChart/Barchart'
import Last3Transactions from './Last3Transactions'

const Dashboard = (props) => {
    const [apiData,setApiData] = useState([])
    const [credit, setCredit] = useState(0)
    const [debit, setDebit] = useState(0)
    const [lastTransactions,setTransactions] = useState([])
    const [data,setData]= useState([])

const getTransactionsTotal = async()=>{
        const url  = "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin"
        const options = {
        method:"GET",
        headers :{
            "content-type":"application/json",
        "x-hasura-admin-secret":"g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role":"admin"
        }}
        const response = await fetch(url,options)
        const data = await response.json()
        // console.log(data)

        const amount = data.transaction_totals_admin
        setDebit(amount[0].sum)
        setCredit(amount[1].sum)
        
    
}

const getLastTransactions = async() =>{
    const url  = "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=0"
        const options = {
        method:"GET",
        headers :{
            "content-type":"application/json",
        "x-hasura-admin-secret":"g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role":"admin"
        }}
        const response = await fetch(url,options)
        const data = await response.json()
        

        const transactions = data.transactions
        // console.log(transactions)
        setTransactions(transactions)
}

const getLast7daysCrDr = async() =>{
    const url  = " https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days"
        const options = {
        method:"GET",
        headers :{
            "content-type":"application/json",
        "x-hasura-admin-secret":"g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role":"admin"
        }}
        const response = await fetch(url,options)
        const data = await response.json()
        console.log(data)

        // const transactions = data.transactions
        // // console.log(transactions)
        // setTransactions(transactions)
}

useEffect(()=>{
    getLastTransactions()
    getTransactionsTotal()
    getLast7daysCrDr()
   
},[])



  return (
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
    <Last3Transactions data = {lastTransactions} />
        </div>

        </div>
        <div className='dash-bottom-section'>
            <p className='last-transaction'>Debit & Credit Overview</p>
            <div className='bottom-trans-card'>
                <Barchart />
            </div>
        </div>
    </div>
  )
}

export default Dashboard