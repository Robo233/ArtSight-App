import React, { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import Button from "../buttons/Button";
import LoadingSpinner from "./LoadingSpinner";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import parseMarkup from "../utils/parseMarkup";

interface ChatBotProps {
  id: string;
  languageCode: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ id, languageCode }) => {
  const suggestedQuestions: string[] = t(`chatBot.suggestedQuestions`, {
    returnObjects: true,
  });

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggestedQuestionsContainerRef = useRef<HTMLDivElement>(null);

  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState<
    { text: string; fromUser: boolean }[]
  >([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [centerSuggested, setCenterSuggested] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setContainerHeight(responses.length === 0 ? 0 : 50);
  }, [responses]);

  const checkSuggestedQuestionsWidth = useCallback(() => {
    if (suggestedQuestionsContainerRef.current) {
      const container = suggestedQuestionsContainerRef.current;
      setCenterSuggested(container.scrollWidth <= container.clientWidth);
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  useEffect(() => {
    checkSuggestedQuestionsWidth();
  }, [checkSuggestedQuestionsWidth, suggestedQuestions]);

  const handleStartConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_APP}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, languageCode }),
      });
      const data = await response.json();
      localStorage.setItem("conversationToken", data.conversationToken);
      setResponses((prev) => [
        ...prev,
        { text: data.response, fromUser: false },
      ]);
      setConversationStarted(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
    setIsLoading(false);
  };

  const fetchResponse = async (prompt: string) => {
    setIsLoading(true);
    try {
      const conversationToken = localStorage.getItem("conversationToken") || "";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_APP}/ai/followup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, languageCode, conversationToken }),
        }
      );
      const data = await response.json();
      setResponses((prev) => [
        ...prev,
        { text: data.response, fromUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (userInput.trim() !== "") {
      setResponses((prev) => [...prev, { text: userInput, fromUser: true }]);
      fetchResponse(userInput);
      setUserInput("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleQuestionClick = (question: string) => {
    setResponses((prev) => [...prev, { text: question, fromUser: true }]);
    fetchResponse(question);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center bottom-0 relative z-20 mx-4">
        {!conversationStarted ? (
          <>
            {!isLoading ? (
              <div className="w-full max-w-[768px] flex justify-center">
                <ButtonWithLabel
                  onClick={handleStartConversation}
                  label={t("chatBot.startConversation")}
                />
              </div>
            ) : (
              <div className="relative left-0 w-24 h-24 pt-4">
                <LoadingSpinner />
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className={`bg-background ${
                containerHeight ? "border" : ""
              }  border-text rounded-lg flex flex-col mx-auto ${
                responses.length > 0 ? "pl-4" : "pl-0"
              } `}
              style={{
                height: `${containerHeight}vh`,
              }}
            >
              <div
                className="overflow-y-auto flex-grow "
                ref={messageContainerRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                <div className="mt-2 space-y-2 mr-3 mb-3">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className="flex justify-start w-full"
                      style={{
                        justifyContent: response.fromUser
                          ? "flex-end"
                          : "flex-start",
                      }}
                    >
                      <p
                        className={`inline-block max-w-[80%] p-3 rounded-3xl ${
                          response.fromUser ? "bg-primary-hover" : "bg-primary"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: parseMarkup(response.text),
                        }}
                      />
                    </div>
                  ))}
                  {isLoading && (
                    <>
                      <div ref={bottomRef} className="relative w-24 pt-10 ">
                        <LoadingSpinner />
                      </div>
                      <div className="relative h-1 top-20"></div>
                      {/* This div is needed, otherwise the loading icon is too close to the bottom */}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center px-2 w-full md:max-w-[768px] mt-2">
              <form onSubmit={handleSubmit} className="relative w-full mb-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder={t("chatBot.askAi")}
                  className="h-10 w-full border-[1px] border-text rounded-3xl pl-3 pr-12 py-2 bg-background placeholder-text-hover focus:outline-none focus:ring-primary focus:border-primary"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-[50%] transform -translate-y-1/2 h-7 w-7 flex items-center justify-center bg-text text-background p-2 rounded-full"
                  activeClassName="bg-text-hover"
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
              </form>
            </div>
            <div className="full-bleed">
              <div className="overflow-x-auto px-4">
                <div
                  ref={suggestedQuestionsContainerRef}
                  className={`flex flex-nowrap items-center  ${
                    centerSuggested ? "justify-center" : "justify-start"
                  }`}
                >
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="bg-primary mx-1 text-md px-2 py-1 rounded-full whitespace-nowrap"
                      activeClassName="bg-primary-hover"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
