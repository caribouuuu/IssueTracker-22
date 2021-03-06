import React, { useState } from 'react';
import styled from 'styled-components';
import RelativeTime from '../../../lib/relativeTime';
import UserProfileContainer from '../../user-profile/UserProfileContainer';
import CommentEditor from '../../issue-form/components/CommentEditor';
import imageUploadHandler from '../../../lib/imageUploadHandler';
import apiUri from '../../../constants/api';

const Input = styled.div`
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
  background-color: white;
`;

const IssueDetailContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0 10px;
  margin: 15px 0;
  font-size: 14px;
  color: #24292;
  line-height: 1.5;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
`;

const IssueDetailStyle = styled.div`
  width: 100%;
  border: 1px solid rgba(3, 102, 214, 0.2);
  border-radius: 6px;
  min-width : 100px;
`;

const CommentTitle = styled.div`
  display: flex;
  color: #586069;
  background-color: #f1f8ff;
  min-height: 50px;
  padding-right: 16px;
  padding-left: 16px;
  border-bottom: 1px solid rgba(3, 102, 214, 0.2);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-size: 14px;
`;

const CommentDescription = styled.div`
  display: flex;
  min-height: 200px;
  padding: 10px;
`;

const Author = styled.div`
  margin: auto 0;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: #24292e;
  background-color: initial;
  font-weight: 600;
`;

const Info = styled.div`
  margin: auto 0;
  margin-left: 10px;
`;

const Description = styled.div`
  margin: auto 0;
`;

const EditButton = styled.button`
  display: flex;
  float: left;
  padding: 3px 12px;
  font-size: 16px;
  line-height: 20px;
  color: black;
  background: none;
  border: none;
  cursor: pointer;
  margin: auto 0;
  margin-left: auto;
  width: auto;
  outline:none;
`;
const CancelButton = styled.button`
  all: unset;
  display: block;
  font-size: 15px;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
  background-color: white;
  font: 400 13.3333px Arial;;
  font-size: 15px;
  padding: 8px 15px;
  margin-left:auto;
  margin-right: 10px;
`;
const SaveButton = styled.button`
  display: block;
  color: white;
  font-size: 15px;
  background-color: #0DBF18;
  border: 1px solid #009B09;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
`;

const FlexRowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
`;

const IssueDetail = (data) => {
  const { children } = data;
  const time = RelativeTime(children.createdAt);
  const { user } = children;
  const [description, setDescription] = useState(children.description);
  const [mode, setMode] = useState(false);
  const [basicDesc, setBasicDesc] = useState(children.description);
  const renderImageTag = async (file) => {
    const { name: imageAlt } = file;

    try {
      const imageUrl = await imageUploadHandler(file);
      const imageTag = `\n\n<img alt="${imageAlt}" src="${imageUrl}">\n\n`;

      const newDescription = description + imageTag;
      setDescription(newDescription);
    } catch (error) {
      alert('failed to upload image');
    }
  };
  const uploadFile = (e) => {
    const { files } = e.target;
    files.forEach((file) => renderImageTag(file));
  };
  const changeMode = () => {
    setMode(!mode);
  };
  const cancelEditDesc = () => {
    setMode(!mode);
    setDescription(basicDesc);
  };
  const saveEditDesc = async () => {
    // fetch -> description update...
    const body = {
      issue_id: children.id,
      description,
    };

    const response = await fetch(apiUri.issueUpdate, {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const { success, message } = await response.json();

    if (!success) {
      alert(message);
      return;
    }

    setBasicDesc(description);
    setMode(!mode);
  };

  const setIssueDesc = (e) => {
    setDescription(e.target.value);
  };

  if (mode) {
    return (
      <>
        <IssueDetailContainer>
          <UserProfileContainer user={user} />
          <Input>
            <CommentEditor onChange={setIssueDesc} value={description} onFileUpload={uploadFile}/>
            <FlexRowBetween>
              <CancelButton onClick={cancelEditDesc}>cancel</CancelButton>
              <SaveButton type="submit" value="Submit" onClick={saveEditDesc}>save</SaveButton>
            </FlexRowBetween>
          </Input>
        </IssueDetailContainer>
      </>
    );
  }
  return (
    <>
      <IssueDetailContainer>
        <UserProfileContainer user={user} />
        <IssueDetailStyle>
          <CommentTitle>
            <Author>{ children.user.nickname}</Author>
            <Info>
              commented
              { time }
            </Info>
            <EditButton onClick={changeMode}>Edit</EditButton>
          </CommentTitle>
          <CommentDescription>
            <Description>{ description }</Description>
          </CommentDescription>
        </IssueDetailStyle>
      </IssueDetailContainer>
    </>
  );
};

export default IssueDetail;
