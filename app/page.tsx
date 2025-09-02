'use client'

import { Button, Flex, Layout, Typography } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Press_Start_2P } from "next/font/google";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

// Helper function to safely parse numbers from localStorage
const safeNumber = (value: string | undefined | null) =>
  value && !isNaN(Number(value)) ? Number(value) : 0;

export default function Home() {

  function getSafeLocalStorage(): Storage | undefined {
   if (typeof window !== 'undefined') {
       return localStorage;
    }
    return undefined
}

 // Safe initialization from localStorage
  const [count, setCount] = useState<number>(
    () => safeNumber(getSafeLocalStorage()?.getItem("count"))
  );
  
  const [slimeFarmerCount, setSlimeFarmerCount] = useState<number>(
  () => safeNumber(getSafeLocalStorage()?.getItem("slimeFarmerCount"))
  );

  const [doubleClickPurchased, setDoubleClickPurchased] = useState<boolean>(
  () => getSafeLocalStorage()?.getItem("doubleClickPurchased") === "true"
  );
  
  const [doubleFarmerPurchased, setDoubleFarmerPurchased] = useState<boolean>(
  () => getSafeLocalStorage()?.getItem("doubleFarmerPurchased") === "true"
  );

  const [frogFarmCount, setFrogFarmCount] = useState<number>(
    () => safeNumber(getSafeLocalStorage()?.getItem("frogFarmCount"))
  );

  const [frogFactoryCount, setFrogFactoryCount] = useState<number>(
    () => safeNumber(getSafeLocalStorage()?.getItem("frogFactoryCount"))
  );

  const [slimePerSecond, setSlimePerSecond] = useState<number>(0);

  const farmerProduction = slimeFarmerCount * (doubleFarmerPurchased ? 2 : 1);

  //Setting frog farm prices
  const frogFarmBaseCost = 100;
  const frogFarmGrowthRate = 1.0185;
  const frogFarmCost = Math.floor(frogFarmBaseCost * Math.pow(frogFarmGrowthRate, frogFarmCount));

  //Setting frog farm prices
  const frogFactoryBaseCost = 10000;
  const frogFactoryGrowthRate = 1.0185;
  const frogFactoryCost = Math.floor(frogFactoryBaseCost * Math.pow(frogFactoryGrowthRate, frogFactoryCount));

  //Buy a frog Factory
  const buyFrogFactory = useCallback(() => {
    if (count < frogFactoryCost) return; //can they afford it?

    setCount(cur => {
      const newCount = cur - frogFactoryCost;
      getSafeLocalStorage()?.setItem("count", String(newCount));
      return newCount;
    }); //take the cost away from count

    setFrogFactoryCount(cur => {
      const newCount = cur + 1;
      getSafeLocalStorage()?.setItem("frogFactoryCount", String(newCount));
      return newCount;
    }); //add a frog factory to the frog farm count
  }, [count, frogFactoryCost]);

  //Buy a frog farm
  const buyFrogFarm = useCallback(() => {
    if (count < frogFarmCost) return; //can they afford it?

    setCount(cur => {
      const newCount = cur - frogFarmCost;
      getSafeLocalStorage()?.setItem("count", String(newCount));
      return newCount;
    }); //take the cost away from count

    setFrogFarmCount(cur => {
      const newCount = cur + 1;
      getSafeLocalStorage()?.setItem("frogFarmCount", String(newCount));
      return newCount;
    }); //add a frog farm to the frog farm count
  }, [count, frogFarmCost]);

  //Click frog to increase slime
  const onFrogClick = useCallback(() => {
  setCount(curCount => {
    const increment = doubleClickPurchased ? 2 : 1; 
    const newCount = curCount + increment;
    getSafeLocalStorage()?.setItem("count", String(newCount));
    return newCount;
  });
  }, [doubleClickPurchased]);

  const baseCost = 5;
  const growthRate = 1.0185; // 1% increase per farmer
  const farmerCost = Math.floor(baseCost * Math.pow(growthRate, slimeFarmerCount));

  //Buy slime farmer
  const onButtonClick = useCallback(() => {
    if (count < farmerCost) return; // not enough slime

    setCount((curCount) => {
      const newCount = curCount - farmerCost;
      getSafeLocalStorage()?.setItem("count", `${newCount}`);
      return newCount;
    });

    setSlimeFarmerCount((curSlimeFarmerCount) => {
      const newFarmerCount = curSlimeFarmerCount + 1;
      getSafeLocalStorage()?.setItem("slimeFarmerCount", `${newFarmerCount}`);
      return newFarmerCount;
    });
  }, [count, farmerCost]);

  //Farmers produce 1 slime every second.
  useEffect(() => {
  const interval = setInterval(() => {
    if (slimeFarmerCount > 0) {
      const productionPerSecond = doubleFarmerPurchased ? slimeFarmerCount * 2 : slimeFarmerCount;
      setCount(curCount => {
        const newCount = curCount + productionPerSecond;
        getSafeLocalStorage()?.setItem("count", String(newCount));
        return newCount;
      });
    }
  }, 1000);

  return () => clearInterval(interval);
  }, [slimeFarmerCount, doubleFarmerPurchased]);

  useEffect(() => {
  const interval = setInterval(() => {
    if (slimeFarmerCount > 0 || frogFarmCount > 0) {
      setCount(cur => {
        const farmerProduction = slimeFarmerCount * (doubleFarmerPurchased ? 2 : 1);
        const frogFarmProduction = frogFarmCount * 10; // each gives 10 slime/sec
        const frogFactoryProduction = frogFactoryCount *100 // each gives 100 slime/sec
        const totalSlimeProduction = frogFarmProduction + farmerProduction + frogFactoryProduction;

        //update slimePerSecond state
        setSlimePerSecond(totalSlimeProduction);

        const newCount = cur + totalSlimeProduction;
        getSafeLocalStorage()?.setItem("count", String(newCount));
        return newCount;
        getSafeLocalStorage()?.setItem("count", String(newCount));
        return newCount;
      });
    } else {
      //if nothing is producing, set it to zero.
      setSlimePerSecond(0);
    }
  }, 1000);

  return () => clearInterval(interval);
  }, [slimeFarmerCount, frogFarmCount, doubleFarmerPurchased]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#345b05ff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",   // <-- vertical centering
        }}
      >
        <Typography.Title
          level={1}
          className={pressStart.className} // if you're using next/font
          style={{
            color: "limegreen",
            margin: 0,
            textShadow: "2px 2px 0px black",
            fontSize: "2rem", // adjust size if needed
          }}
        >
          Slime Clicker
        </Typography.Title>
      </Header>
      <Layout>
        <Sider width={250} style={{ padding: "1rem", background: "#f0f2f5" }}>
          <Typography.Title level={4}>Upgrades</Typography.Title>
          <Flex vertical gap="small">
            <Button 
              type="primary" 
              block
              onClick={onButtonClick} 
              disabled={count < farmerCost}
            >
              Buy Slime Farmer (Cost: {farmerCost})
            </Button>
            <Flex justify="space-between">
              <Typography.Text>Farmers: {slimeFarmerCount}</Typography.Text>
              <Typography.Text>Slime/s: {farmerProduction}</Typography.Text>
            </Flex>
          </Flex>
          <Button
            type="primary"
            block
            onClick={buyFrogFarm}
            disabled={count < frogFarmCost}
          >
            <div style={{ textAlign: "center" }}>
              Buy Frog Farm
             
              (Cost: {frogFarmCost})
            </div>
          </Button>
          <Flex justify="space-between">
            <Typography.Text>Frog Farms: {frogFarmCount}</Typography.Text>
            <Typography.Text>Slime/s: {frogFarmCount * 10}</Typography.Text>
          </Flex>
          <Button
            type="primary"
            block
            onClick={buyFrogFactory}
            disabled={count < frogFactoryCost}
          >
            <div style={{ textAlign: "center" }}>
              Buy Frog Factory
             
              (Cost: {frogFactoryCost})
            </div>
          </Button>
          <Flex justify="space-between">
            <Typography.Text>Frog Factories: {frogFactoryCount}</Typography.Text>
            <Typography.Text>Slime/s: {frogFactoryCount * 100}</Typography.Text>
          </Flex>
        </Sider>
          <Content style={{ padding: "1rem" }}>
            <Image
              src="/images/frogs/main-guy.png"
              alt="Frog"
              width={500}
              height={250}
              onClick={onFrogClick}
            />
            <Typography.Text style={{ display: "block", marginTop: "1rem" }}>
              Slime: {count} | Slime/s: {slimePerSecond}
              
            </Typography.Text>
          </Content>

          <Sider width={200} style={{ padding: "1rem", background: "#fafafa" }}>
          <Typography.Title level={4}>Boosts</Typography.Title>
          <Flex vertical gap="small">
            {/* Double Click Upgrade */}
            <Button
              type="default"
              block
              style={{ height: "60px" }} // taller button
              disabled={doubleClickPurchased || count < 1000}
              onClick={() => {
                if (count < 1000) return;
                setCount(cur => {
                  const newCount = cur - 1000;
                  getSafeLocalStorage()?.setItem("count", String(newCount));
                  return newCount;
                });
                setDoubleClickPurchased(true);
                getSafeLocalStorage()?.setItem("doubleClickPurchased", "true");
              }}
            >
              <div style={{ textAlign: "center" }}>
                Buy Double Click
                <br />
                Cost: 1000
              </div>
            </Button>

            {/* Double Farmer Production Upgrade */}
            <Button
              type="default"
              block
              style={{ height: "60px" }} // taller button
              disabled={doubleFarmerPurchased || count < 10000}
              onClick={() => {
                if (count < 10000) return;
                setCount(cur => {
                  const newCount = cur - 10000;
                  getSafeLocalStorage()?.setItem("count", String(newCount));
                  return newCount;
                });
                setDoubleFarmerPurchased(true);
                getSafeLocalStorage()?.setItem("doubleFarmerPurchased", "true");
              }}
            >
              <div style={{ textAlign: "center" }}>
                Buy Double Farmers
                <br />
                Cost: 10000
              </div>
            </Button>
          </Flex>
        </Sider>
      </Layout>
    </Layout>
  );
}
