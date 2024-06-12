import { charactersDataObj } from "../lib/config";
import { useRiderCardsContext } from "../lib/hooks";
import { Rider, RiderType } from "../lib/types";
import { v4 as uuidv4 } from "uuid";
import { RIDERS_LIMIT } from "../lib/config";
import { Button, Flex } from "@radix-ui/themes";
import { shuffle } from "../lib/utils";

export default function Form() {
  const { setRidersData, ridersData } = useRiderCardsContext();
  const isDisabled = ridersData.length >= RIDERS_LIMIT;

  const addRider = async (type: RiderType): Promise<void> => {
    let name = "----- ------";
    const data = charactersDataObj.find((character) => character.code === type);

    const response = await fetch(
      "https://api.parser.name/?api_key=65ae76a9a472817634b02508d964689e&endpoint=generate&gender=m&country_code=DE"
    );
    const person = await response.json();
    if (!person.error) {
      name = `${person.data[0].name.firstname.name} ${person.data[0].name.lastname.name}`;
    }

    const newPlayer: Rider = {
      id: uuidv4(),
      name: name,
      type: type,
      label: data?.label || "",
      deck: shuffle([...(data?.deck || [])]),
      hand: [],
      stash: [],
      selected: [],
    };

    setRidersData([...ridersData, newPlayer]);
  };

  return (
    <Flex justify="center" gapX="2">
      <Button
        variant="classic"
        onClick={() => addRider("rouler")}
        disabled={isDisabled}
      >
        Add new Rouler
      </Button>
      <Button onClick={() => addRider("sprinter")} disabled={isDisabled}>
        Add new Sprinter
      </Button>
    </Flex>
  );
}
