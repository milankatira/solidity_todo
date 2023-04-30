import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
import TaskAbi from "../abi/TaskContract.json";
import { ContractAddress } from "../config";
import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);
  const [connectNetWord, setconnectNetWord] = useState(false);
  const [userLogin, setuserLogin] = useState(false);
  const [currentAccount, setcurrentAccount] = useState(false);
  const [input, setinput] = useState("");
  const [tasks, settasks] = useState([]);
  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("chainId", chainId);
      const binanceChainId = "0x61";
      if (chainId !== binanceChainId) {
        alert("you are not connected to binance chain");
        setconnectNetWord(false);
        return;
      } else {
        setconnectNetWord(true);
      }
      const account = await ethereum.request({ method: "eth_requestAccounts" });

      setuserLogin(true);
      setcurrentAccount(account[0]);

      console.log("account", account);
    } catch (err) {
      console.log("err", err);
    }
  };

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          TaskAbi.abi,
          signer
        );

        let alltasks = await contract.getMyTask();
        console.log("tasks", alltasks);
        settasks(alltasks);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          TaskAbi.abi,
          signer
        );

        let tx = await contract.addTask(task.taskText, task.isDeleted);
        console.log("completed task");
        console.log("tx", tx);
        let receipt = await tx.wait();
        console.log("receipt", receipt);
        setinput("");
        getAllTasks()
      }
    } catch (err) {
      console.log(err, "error");
    }
  };

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (key) => async () => {
    try {
      console.log(key, "key here");
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          TaskAbi.abi,
          signer
        );

        let tx = await contract.deleteTask(key, true);
        console.log("completed task");
        console.log("tx", tx);
        let receipt = await tx.wait();
        console.log("receipt", receipt);
        getAllTasks()
      }
    } catch (err) {
      console.log(err, "error");
    }
  };

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {!userLogin ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : connectNetWord ? (
        <TodoList
          deleteTask={deleteTask}
          tasks={tasks}
          setinput={setinput}
          input={input}
          addTask={addTask}
        />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
}
