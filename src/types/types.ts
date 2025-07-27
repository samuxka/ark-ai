type SearchChatProps = {
  isClose: boolean;
  ToggleSidebar: () => void;
  onSearchChange: (value: string) => void;
};


interface NewChatProps {
  isClose: boolean;
}

interface SettingsProps {
  isClose: boolean;
}

type CardChatProps = {
  id: string;
  title: string;
  isClose: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
};
