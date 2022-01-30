import React from "react";
import { Box, TextField, Button } from "@skynexui/components";

import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

import appConfig from "../config.json";
import { Header } from "../src/components/header";
import { MessageList } from "../src/components/messageList";
import { ButtonSendSticker } from "../src/components/buttonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ4MTI1OSwiZXhwIjoxOTU5MDU3MjU5fQ.OstSKsK9Baxcd62fqE2vd-obaNAFIH2rt33ZsgyyTtg";
const SUPABASE_URL = "https://msptzzofgtwenlyaslme.supabase.co";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listnerPosts(addNewPost) {
  return supabaseClient
    .from("posts")
    .on("*", (data) => {
      const post = {
        id: data.eventType === "DELETE" ? data.old.id : data.new.id,
        ...data.new,
      };
      
      addNewPost({ type: data.eventType, post });
    })
    .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const authenticatedUser = router.query.username || "";
  const [message, setMessage] = React.useState("");
  const [listPosts, setListPosts] = React.useState([]);

  React.useEffect(async () => {
    supabaseClient
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListPosts(data);
      });

    const subscription = listnerPosts((data) => {
      const { type, post } = data;
      setListPosts((listPosts) => {
        if (type === "DELETE") {
          const newList = listPosts.filter((item) => item.id !== post.id);
          return newList;
        }

        return [post, ...listPosts];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function handlerMessage(event) {
    const newMessage = event.target.value;
    setMessage(newMessage);
  }

  function sendMessage(message) {
    if (message.length > 0) {
      const newPost = {
        from: authenticatedUser,
        message,
      };

      insertNewPost(newPost);
    }
  }

  function sendSticker(sticker) {
    sendMessage(`:sticker: ${sticker}`);
  }

  async function insertNewPost(post) {
    await supabaseClient
      .from("posts")
      .insert([post])
      .then(() => {
        setMessage("");
      });
  }

  async function deletePost(id) {
    await supabaseClient.from("posts").delete().eq("id", id);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            listPosts={listPosts}
            authenticatedUser={authenticatedUser}
            onDeletePost={deletePost}
          />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              value={message}
              onChange={handlerMessage}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <ButtonSendSticker
              onStickerClick={sendSticker}
            />

            <Button
              iconName="FaTelegramPlane"
              label=""
              size="xl"
              colorVariant="positive"
              onClick={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              styleSheet={{
                marginLeft: "6px",
                width: "50px",
                marginBottom: "8px",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
