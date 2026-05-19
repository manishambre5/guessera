import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Item } from "../ui/item";
import { Separator } from "../ui/separator";

export default function PartyHistory() {

    return (
        <Card size="sm" className="flex-1 rounded-lg">
            <CardHeader className="text-center">
                <CardTitle>History</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-2">
                <Item variant="outline">Game 1</Item>
                <Item variant="outline">Game 2</Item>
                <Item variant="outline">Game 3</Item>
            </CardContent>
        </Card>
    );
}