import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";

//TODO: Add annotations to the images and finish the guide.

export default function About() {

    return (
        <SheetContent className="p-2">
            <SheetHeader>
                <SheetTitle>How to Play GuessEra</SheetTitle>
                <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto flex flex-col gap-4">
                <img src="/how-to-play/home_default.png" alt="Game setup screen" className="border rounded-xl" />
                <img src="/how-to-play/home_multi.png" alt="Game setup screen - Multiplayer" className="border rounded-xl" />
                <img src="/how-to-play/preferences.png" alt="Game setup screen - Preferences" className="border rounded-xl p-2" />
                <img src="/how-to-play/arena-1.png" alt="Arena" />
                <img src="/how-to-play/arena-2.png" alt="Arena" />
                <img src="/how-to-play/create_party.png" alt="Create Party" className="border rounded-xl" />
                <img src="/how-to-play/join_party.png" alt="Join Party" className="border rounded-xl" />
                <img src="/how-to-play/party.png" alt="Party" className="border rounded-xl" />
            </div>
        <SheetFooter></SheetFooter>
        </SheetContent>
    );
}