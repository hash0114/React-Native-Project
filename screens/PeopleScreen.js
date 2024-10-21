import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button, FlatList, View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { Icon } from 'react-native-elements';  
import { format } from "date-fns";  

export default function PeopleScreen({navigation}) {
  //const navigation = useNavigation();
  const { people } = useContext(PeopleContext);

  // Function to extract and format only the month and day
  const formatBirthday = (dob) => {
    const date = dob.split(" ")[0].split("/");
    return format(new Date(date.map((key) => `${key}` ).join('-')),"MMMM dd")
  };

  // Sort the people array by month and day
  const sortedPeople = people.sort((a, b) => {
    const dateA = new Date(a.dob.split(" ")[0].split("/").map((key) => `${key}` ).join('-'));
    const dateB = new Date(b.dob.split(" ")[0].split("/").map((key) => `${key}` ).join('-'));
    if (dateA.getMonth() !== dateB.getMonth()) {
      return dateA.getMonth() - dateB.getMonth(); // Compare months
    }
    else {
      return dateA.getDate() - dateB.getDate(); // Compare days
    }
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {people.length === 0 ? (
          // Show this message when the array is empty
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>No people found. Please add the first person.</Text>
          </View>
        ) : (
          // Display the list when there are people
          <FlatList
            data={sortedPeople}
            style={styles.container}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>{item.name}</Text>
                  <Text style={styles.listDOB}>{formatBirthday(item.dob)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("IdeaScreen", { id: item.id })}
                >
                  <Icon name="lightbulb-outline" type="material" size={24} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Button or FAB to navigate to the AddPersonScreen */}
        <Button
          title="Add Person"
          onPress={() => {navigation.navigate("AddPersonScreen")}}//navigation.navigate("AddPersonScreen")}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  listItem: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    backgroundColor:"#cdcbcc",
    margin: 5,
  },
  listTitle: {
    fontSize: 20,
  },
  listDOB: {
    fontSize: 12,
    color: "#666",
    },
});