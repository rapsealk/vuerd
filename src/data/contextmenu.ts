import StoreManagement from '@/store/StoreManagement';
import Menu from '@/models/Menu';
import {Commit as TableCommit} from '@/store/table';
import {Commit as MemoCommit} from '@/store/memo';
import {Commit as RelationshipCommit, RelationshipType} from '@/store/relationship';
import {Commit as CanvasCommit, ShowKey} from '@/store/canvas';
import {Bus} from '@/ts/EventBus';
import icon from '@/ts/icon';
import {uuid} from '@/ts/util';
import {Database} from './dataType';

function dataMenu(store: StoreManagement): Menu[] {
  const show = store.canvasStore.state.show;
  const database = store.canvasStore.state.database;
  return [
    {
      id: uuid(),
      name: 'New Table',
      keymap: 'Alt + N',
      icon: 'table',
      execute() {
        store.tableStore.commit(TableCommit.tableAdd, store);
      },
    },
    {
      id: uuid(),
      name: 'New Memo',
      keymap: 'Alt + M',
      icon: 'sticky-note',
      execute() {
        store.memoStore.commit(MemoCommit.memoAdd, store);
      },
    },
    {
      id: uuid(),
      name: 'Primary Key',
      keymap: 'Alt + K',
      icon: 'key',
      execute() {
        store.tableStore.commit(TableCommit.columnPrimaryKey);
      },
    },
    {
      id: uuid(),
      name: '1 : 1',
      keymap: 'Alt + 1',
      icon: icon[RelationshipType.ZeroOne],
      base64: true,
      execute() {
        store.relationshipStore.commit(RelationshipCommit.relationshipDrawStart, {
          store,
          relationshipType: RelationshipType.ZeroOne,
        });
      },
    },
    {
      id: uuid(),
      name: '1 : N',
      keymap: 'Alt + 2',
      icon: icon[RelationshipType.ZeroOneN],
      base64: true,
      execute() {
        store.relationshipStore.commit(RelationshipCommit.relationshipDrawStart, {
          store,
          relationshipType: RelationshipType.ZeroOneN,
        });
      },
    },
    {
      id: uuid(),
      name: 'View Option',
      children: [
        {
          id: uuid(),
          icon: show.tableComment ? 'check' : undefined,
          name: 'Table Comment',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.tableComment,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.tableComment},
        },
        {
          id: uuid(),
          icon: show.columnComment ? 'check' : undefined,
          name: 'Column Comment',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.columnComment,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.columnComment},
        },
        {
          id: uuid(),
          icon: show.columnDataType ? 'check' : undefined,
          name: 'dataType',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.columnDataType,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.columnDataType},
        },
        {
          id: uuid(),
          icon: show.columnNotNull ? 'check' : undefined,
          name: 'Not Null',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.columnNotNull,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.columnNotNull},
        },
        {
          id: uuid(),
          icon: show.columnDefault ? 'check' : undefined,
          name: 'Default',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.columnDefault,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.columnDefault},
        },
        {
          id: uuid(),
          icon: show.relationship ? 'check' : undefined,
          name: 'Relationship',
          execute() {
            store.canvasStore.commit(CanvasCommit.showChange, {
              showKey: ShowKey.relationship,
              store,
            });
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, show: ShowKey.relationship},
        },
      ],
    },
    {
      id: uuid(),
      name: 'Database',
      children: [
        {
          id: uuid(),
          icon: database === Database.MariaDB ? 'check' : undefined,
          name: Database.MariaDB,
          execute() {
            store.canvasStore.commit(CanvasCommit.databaseChange, Database.MariaDB);
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, database: Database.MariaDB},
        },
        {
          id: uuid(),
          icon: database === Database.MSSQL ? 'check' : undefined,
          name: Database.MSSQL,
          execute() {
            store.canvasStore.commit(CanvasCommit.databaseChange, Database.MSSQL);
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, database: Database.MSSQL},
        },
        {
          id: uuid(),
          icon: database === Database.MySQL ? 'check' : undefined,
          name: Database.MySQL,
          execute() {
            store.canvasStore.commit(CanvasCommit.databaseChange, Database.MySQL);
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, database: Database.MySQL},
        },
        {
          id: uuid(),
          icon: database === Database.Oracle ? 'check' : undefined,
          name: Database.Oracle,
          execute() {
            store.canvasStore.commit(CanvasCommit.databaseChange, Database.Oracle);
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, database: Database.Oracle},
        },
        {
          id: uuid(),
          icon: database === Database.PostgreSQL ? 'check' : undefined,
          name: Database.PostgreSQL,
          execute() {
            store.canvasStore.commit(CanvasCommit.databaseChange, Database.PostgreSQL);
            store.eventBus.$emit(Bus.ERD.change);
          },
          option: {close: false, database: Database.PostgreSQL},
        },
      ],
    },
  ];
}

export {
  dataMenu,
};