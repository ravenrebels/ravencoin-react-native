import "react-native-get-random-values"; //Must be the first import
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Card, Input, Text } from "@rneui/base";
import * as Clipboard from "expo-clipboard";
import { View, ScrollView } from "react-native";
import { useBalance } from "./useBalance.js";
import { useAddressObjects } from "./useAddressObjects.js";
import { toAddresses } from "./toAddresses.js";

import { send } from "./send.js";

const styles = {
  container: {
    marginTop: 50,
    padding: 10,
  },
};

//Lets hard code a mnemonic for this example,so we can send it assets and RVN

//Create a random mnemonic
//const randomMnemonic = RavencoinHandler.generateMnemonic();

export default function App() {
  const [mnemonic] = React.useState(
    "diagram gossip squirrel attitude illness table degree hello cannon saddle play afford"
  );
  const [tick, setTick] = React.useState(0);
  const addressObjects = useAddressObjects(mnemonic);

  const [recipientAddress, setRecipientAddress] = React.useState(
    "mpMRG3rGhbnbE5S75ts9Kx3DEYBhzmuJyE"
  );
  const addresses = toAddresses(addressObjects);
  const balance = useBalance(tick, addresses);

  //Set a ticker that so we can update lets say every 30 seconds
  //If you want to force an update, just update "tick"
  React.useEffect(() => {
    function ticky() {
      setTick(new Date().getTime());
    }
    const interval = setInterval(ticky, 30 * 1000);
    ticky(); //Run once on startup
    return function cleanUp() {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <Text h3>Ravencoin packages from @RavenRebels!</Text>
          <Text style={{ fontSize: 18, marginTop: 20 }}>TESTNET</Text>
          <TextWithLabel label="Mnemonic" text={mnemonic} />
          <TextWithLabel
            label="First address (testnet)"
            text={addresses.length && addresses[0]}
          />
          <Button
            title="Copy address"
            onPress={() =>
              Clipboard.setStringAsync(addresses.length && addresses[0])
            }
          ></Button>
          <TextWithLabel label="Balance" text={balance / 1e8} />

          <Card>
            <Card.Title>Send RVN</Card.Title>
            <Input
              placeholder="Enter Ravencoin address here"
              containerStyle={{ width: 340 }} // Set the width here
              label="To address"
              defaultValue={recipientAddress}
              onChangeText={(text) => {
                setRecipientAddress(text);
              }}
            />
            <Button
              title="Send 1 RVN"
              onPress={async (event) => {
                try {
                  const id = await send(addressObjects, 1, recipientAddress);
                  alert("Sending transaction " + id);
                  console.log("Sending", id);
                } catch (e) {
                  alert("Error " + e);
                }
              }}
            ></Button>
          </Card>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

function TextWithLabel({ label, text }) {
  return (
    <Card>
      <View style={{ marginTop: 40 }}>
        <Card.Title>{label}</Card.Title>
        <Card.Divider />
        <Text>{text}</Text>
      </View>
    </Card>
  );
}
