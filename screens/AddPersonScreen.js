import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-modern-datepicker";

export default function AddPersonScreen() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const savePerson = () => {
    if (name && dob) {
      addPerson(name, dob);
      navigation.goBack();
    } else {
      setModalVisible(!modalVisible);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={{
        flex: 1,
        alignContent: "center",
        padding: 5,
        marginVertical: 10,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
          flex: 1,
          justifyContent: "space-between",
        }}>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{"Name"}</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={{
                borderBottomColor: "lightblue",
                borderBottomWidth: 2,
                marginVertical: 15,
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 5 }}>
              {"Date of Birth"}
            </Text>
            <DatePicker
              onSelectedChange={(selectedDate) => {
                setDob(selectedDate);
              }}
              options={{
                backgroundColor: "white",
                textHeaderColor: "black",
                textDefaultColor: "black",
                selectedTextColor: "white",
                mainColor: "#8b1a10", //arrows
                textSecondaryColor: "#777", //dow
                borderColor: "#5885e1",
              }}
              style={{
                width: "85%",
                alignSelf: "center",
                borderRadius: 10,
                padding: 20,
                margin: 20,
              }}
              current={"1990-01-01"}
              selected={"1990-01-15"}
              maximumDate={new Date().toDateString()}
              mode="calendar"
            ></DatePicker>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View
                style={{
                  top: "70%",
                }}
              >
                <View
                  style={{
                    margin: 10,
                    backgroundColor: "white",
                    borderRadius: 5,
                    alignItems: "center",
                    padding: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "center",
                      marginVertical: 10,
                      color: "black",
                    }}
                  >
                    {
                      "Please make sure you enter name and date of birth"
                    }
                  </Text>
                  <Button
                    title="Close"
                    color={"#5885e1"}
                    onPress={savePerson}
                  />
                </View>
              </View>
            </Modal>
          </View>
          <View style={{ gap: 5 }}>
            <Button
              title="Save"
              color={"#5885e1"}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <Button
              title="Cancel"
              color={"#8b1a10"}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
