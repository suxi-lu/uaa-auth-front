import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Form,
  Icon,
  Menu,
  message
} from "antd";
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { useState } from "react";

// import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from "antd/es/form";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
// import { connect } from 'dva';
import ProTable, {
  ProColumns,
  UseFetchDataAction
} from "@ant-design/pro-table";
import { TableUaaUserItem } from "@/pages/uaa/user/data";
import {
  addUser,
  queryUser,
  removeUser,
  updateUser
} from "@/pages/uaa/user/service";
import UaaUserForm from "@/pages/uaa/user/components/UaaUserForm";

const isAdmin = ["否", "是"];
const statusMap = ["error", "success"];
interface TableListProps extends FormComponentProps {}

/**
 * 添加用户
 * @param fields
 */
const handleAdd = async (fields: Partial<TableUaaUserItem>) => {
  const hide = message.loading("正在添加");
  try {
    await addUser(fields);
    hide();
    message.success("添加成功");
    return true;
  } catch (error) {
    hide();
    message.error("添加失败请重试！");
    return false;
  }
};

/**
 * 更新用户
 * @param fields
 */
const handleUpdate = async (fields: Partial<TableUaaUserItem>) => {
  const hide = message.loading("正在更新");
  try {
    await updateUser(fields);
    hide();

    message.success("更新成功");
    return true;
  } catch (error) {
    hide();
    message.error("更新失败请重试！");
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableUaaUserItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeUser({
      key: selectedRows.map(row => row.id)
    });
    hide();
    message.success("删除成功，即将刷新");
    return true;
  } catch (error) {
    hide();
    message.error("删除失败，请重试");
    return false;
  }
};

const UaaUserTable: React.FC<TableListProps> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [userFormValues, setUserFormValues] = useState({});

  const [actionRef, setActionRef] = useState<
    UseFetchDataAction<{ data: TableUaaUserItem[] }>
  >();
  const columns: ProColumns<TableUaaUserItem>[] = [
    {
      title: "姓名",
      dataIndex: "userName"
    },
    {
      title: "登录名",
      dataIndex: "loginName"
    },
    {
      title: "手机号",
      dataIndex: "mobile"
    },
    {
      title: "邮箱",
      dataIndex: "email"
    },
    {
      title: "是否超级管理员",
      dataIndex: "isAdmin",
      filters: [
        {
          text: isAdmin[0],
          value: "0"
        },
        {
          text: isAdmin[1],
          value: "1"
        }
      ],
      valueEnum: {
        0: "否",
        1: "是"
      },
      render(text, row) {
        return <Badge status={statusMap[row.isAdmin] as "error"} text={text} />;
      }
    },
    {
      title: "上次登录日期",
      dataIndex: "lastLoginDate"
    },
    {
      title: "登录次数",
      dataIndex: "loginCount"
    },
    {
      title: "描述",
      dataIndex: "description"
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleModalVisible(true);
              setUserFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </>
      )
    }
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableUaaUserItem>
        headerTitle="用户列表"
        onInit={setActionRef}
        rowKey="key"
        renderToolBar={(action, { selectedRows }) => [
          <Button
            icon="plus"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === "remove") {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          )
        ]}
        renderTableAlert={(selectedRowKeys, selectedRows) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{" "}
            项&nbsp;&nbsp;
            <span>
              服务调用次数总计 {selectedRows.reduce(pre => pre, 0)} 万
            </span>
          </div>
        )}
        request={params => queryUser(params)}
        columns={columns}
      />
      <UaaUserForm
        onSubmit={async value => {
          const success = value.id
            ? await handleUpdate(value)
            : await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef!.reload();
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        values={userFormValues}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(UaaUserTable);
