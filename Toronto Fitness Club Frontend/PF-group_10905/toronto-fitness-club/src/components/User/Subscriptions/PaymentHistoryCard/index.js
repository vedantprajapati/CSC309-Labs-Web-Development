//display the payment history in a card
import {React, useContext, useEffect} from 'react'
import APIContext from "../../../../Contexts/APIContext";
import PastPaymentsCard from "./PastPaymentsCard";
import UpcomingPaymentsCard from "./UpcomingPaymentsCard";

const PaymentHistoryCard= () => {

    return (
        <div>
            <PastPaymentsCard />
            <UpcomingPaymentsCard />
        </div>
    )
}

export default PaymentHistoryCard
