import { Button, Input, Loading } from "@nextui-org/react";
import { IoSearchOutline } from "react-icons/io5"

export default function InputSearch(props) {
  return (
    <Input {...props}
        clearable
        underlined
        contentRightStyling={false}
        contentRight={
          props.loading
            ? <Button
                disabled
                light
                auto
                css={{width: 48}}>
                  <Loading size="sm"/>
              </Button>
            : <Button
                light
                auto
                icon={ <IoSearchOutline /> }
                css={{width: 48}}
                onPress={() => props.pressSearch()}>
              </Button>
        }
        css={{width: '100%'}} />
  )
}
