import React, { useEffect, useState } from "react";
import { Box, Text, TextField, Image, Button } from "@skynexui/components";

import { createClient } from "@supabase/supabase-js";

import appConfig from "../config.json";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ4MTI1OSwiZXhwIjoxOTU5MDU3MjU5fQ.OstSKsK9Baxcd62fqE2vd-obaNAFIH2rt33ZsgyyTtg";
const SUPABASE_URL = "https://msptzzofgtwenlyaslme.supabase.co";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [message, setMessage] = React.useState("");
  const [listPosts, setListPosts] = React.useState([]);

  React.useEffect(async () => {
    await supabaseClient
      .from("posts")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListPosts(data);
      });
  }, []);

  function handlerMessage(event) {
    const newMessage = event.target.value;
    setMessage(newMessage);
  }

  function sendMessage() {
    if (message.length > 0) {
      const newPost = {
        from: "willflame",
        message,
      };

      insertNewPost(newPost);
    }
  }

  async function insertNewPost(post) {
    await supabaseClient
      .from("posts")
      .insert([post])
      .then(({ data }) => {
        setListPosts([data[0], ...listPosts]);
        setMessage("");
      });
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
          <MessageList listPosts={listPosts} />
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
                  sendMessage();
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
            <Button
              iconName="FaTelegramPlane"
              label=""
              size="xl"
              colorVariant="positive"
              onClick={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  function deletePost(id) {
      supabaseClient.from('posts').delete().eq('id', id);
  }

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
        return (
          <Text
            key={post.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${post.from}.png`}
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
            {post.message}
          </Text>
        );
      })}
    </Box>
  );
}
