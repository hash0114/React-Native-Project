import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const ideas = useRef({})

  const PEOPLE_STORAGE_KEY = "people";
  const IDEAS_STORAGE_KEY = "ideas";

  // Load people and ideas from AsyncStorage
  useEffect(() => {
    const loadPeopleAndIdeas = async () => {
      const savedPeople = await AsyncStorage.getItem(PEOPLE_STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));

      const savedIdeas = await AsyncStorage.getItem(IDEAS_STORAGE_KEY);
      if (savedIdeas) ideas.current = JSON.parse(savedIdeas);
    };
    loadPeopleAndIdeas();
  }, []);

  // Add a new person
  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob,
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await AsyncStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  // Save a new gift idea for a specific person
  const saveIdea = async (newIdea) => {
    const updatedIdeas = {
      ...ideas.current,
      [newIdea.personId]: [...(ideas.current[newIdea.personId] || []), newIdea],
    };
    ideas.current = updatedIdeas;
    await AsyncStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(updatedIdeas));
  };

  // Get gift ideas for a specific person
  const getIdeasForPerson = async (personId) => {
    return ideas.current[personId] || [];
  };

  // Delete a specific idea
  const deleteIdea = async (personId, ideaId) => {
    const updatedIdeas = {
      ...ideas.current,
      [personId]: ideas.current[personId].filter((idea) => idea.id !== ideaId),
    };
    ideas.current= updatedIdeas;
    await AsyncStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(updatedIdeas));
  };

  // Get a person by their ID
  const getPersonById = (personId) => {
    return people.find((person) => person.id === personId);
  };

  return (
    <PeopleContext.Provider
      value={{
        people,
        addPerson,
        saveIdea,
        getIdeasForPerson,
        deleteIdea,
        getPersonById,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
