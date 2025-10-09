import { Warning } from "@mui/icons-material";
import axios from "axios";

export default async function buyStock(props: any){
    
    if (props.stockPrice === null) {
      alert('Stock price not available.');
      return;
    }

    if (Number(props.quantity) == 0) {
      props.setDisplayError({display: true, warning: true, title: "Zero Stocks, Zero Problems", bodyText: "Investing in nothing is technically risk-free, but also profit-free", buttonText: "Got it"})
      return;
    }

    if (Number(props.quantity) < 0) {
      props.setDisplayError({display: true, warning: true, title: "Mirror Trading Attempt", bodyText: "You’ve invented mirror trading. Unfortunately, we only support normal trading here.", buttonText: "Okay Fine..."})
      return;
    }

    if((props.stockPrice * props.quantity) > 999999999){
        props.setDisplayError({display: true, warning: true, title: "Mr. Monopoly", bodyText: "Breaking News: simulator user destabalizes global economy.", buttonText: "Oops... my bad"})
        return
    }

    if((props.stockPrice * props.quantity) > 10000000){
        props.setDisplayError({display: true, warning: true, title: "Relax, Scrooge McDuck", bodyText: "Congratulations, you've spent more than some small countries", buttonText: "Back to Reality"})
        return
    }

    if((props.stockPrice * props.quantity) > 1000000){
        props.setDisplayError({display: true, warning: true, title: "Wolf of Sim Street", bodyText: "That's not a trade, that's a corporate acquisition", buttonText: "Back to Reality"})
        return
    }

    if((props.stockPrice * props.quantity) > 100000){
        props.setDisplayError({display: true, warning: true, title: "Calm Down, Big Spender ", bodyText: "You’'re trying to spend more than £100k in one click. Let's maybe... diversify first?", buttonText: "Fine I'll Chill..."})
        return
    }

    const stockPurchaseRequest = {
      symbol: props.stockSymbol,
      quantity: Number(props.quantity),
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/portfolio/${props.user?.id}/stocks`,
        stockPurchaseRequest
      );
      alert('Stock purchased successfully');
      props.setShowConfetti(true)
      setTimeout(() => {props.setShowConfetti(false)}, 100000)
      props.setIsModalOpen(false);
    } catch (error) {
      console.error('Error purchasing stock:', error);
      alert('Error purchasing stock');
    }

}