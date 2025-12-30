create a project with named "android-app"

create a folder with named "components"
components contains -
Button.js
Card.js
Checkbox.js
EmptyState.js
FloatingActionButton.js
Input.js
Modal.js
SwipeableItem.js

create a folder with named "contexts"

contexts contains -
ThemeContext.js
ToastContext.js

create a folder with named "styles"
styles contains -
global.js


create a folder with named "db"
db contains database.js
init tables
todoItems (id, name, priority, completed, category_id, created_at), categories (id, name, color, created_at)
async Add,Update,Delete,GetAll,GetById for todoItems, categories

create a folder with named "screens"
HomeScreen.js
CategoryScreen.js
SettingsScreen.js

app open showing a
- Splash Screeen
- app title bar always visible with text "TODO List"
- Titlebar right icon showing an dropdown menu

Go to Home screen and showing
- Loading Spinner
- load swipeable list items from todoItems
- floating action button showing popup to create an todo item with prioroty (high, normal, low, medium)
- list item click edit with popup
- swipe to show delete action
- search text box to search list items
- 3 small button with states all, active, completed, placed left under search box
- a button with sort by date, and name toggle placed right under search box

a bottom navigation bar with 3 icons
- Todos, Categories, Settings

Categories showing -
CRUD operation for categories

Settings showing -
toggle dark mode

all db operations showing toast

use tech stack expo, react native, SQLite