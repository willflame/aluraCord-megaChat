import {
  Box,
  Text,
  Image,
  Icon,
} from "@skynexui/components";

import appConfig from "../../config.json";

export function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.listPosts.map((post) => {
        const isAuthor = props.authenticatedUser === post.from;

        return (
          <Text
            key={post.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              marginRight: "10px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${post.from}.png` || appConfig.avatarDefault}
                />
                <Text tag="strong">{post.from}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {post.created_at}
                </Text>
              </Box>

              {isAuthor && (
                <Icon
                  name="FaTrashAlt"
                  label={`excluir mensagem ${post.id}`}
                  size={25}
                  styleSheet={{
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "50%",
                    hover: {
                      backgroundColor: "#fff",
                      color: "#546e7a",
                    },
                  }}
                  onClick={() => {
                    if (Boolean(props.onDeletePost)) {
                      props.onDeletePost(post.id);
                    }
                  }}
                />
              )}
            </Box>
            {post.message.startsWith(":sticker:") ? (
              <Image
                src={post.message.replace(":sticker:", "")}
                width="100px"
              />
            ) : (
              post.message
            )}
          </Text>
        );
      })}
    </Box>
  );
}
