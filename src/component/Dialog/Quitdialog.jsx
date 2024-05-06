import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import DialogContentText from '@mui/material/DialogContentText';
import FormControlLabel from '@mui/material/FormControlLabel';

function Quitdialog() {
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    sameEmail: false,
    review: false,
    point: false,
  });

  const handleToggle = (name) => () => {
    setCheckedItems({ ...checkedItems, [name]: !checkedItems[name] });
  };
/*
  const handleSubmit = () => {
    // 선택된 체크리스트를 서버로 전송하는 로직을 작성합니다.
    console.log("Selected items:", checkedItems);
    // 서버로 데이터를 전송하는 코드를 추가하세요.
    setOpen(false);
  };
  */
  const handleCancel = () => {
    const allChecked = Object.values(checkedItems).every((item)=>item===true);
    if (allChecked) {
        console.log("Cancel success");
    } else {
        console.log("Please complelte the checklist");
    }
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        회원 탈퇴
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>회원 탈퇴</DialogTitle>
        <DialogContent
            sx={{
                display:"flex",
                alignItems:"flex-start",
                flexDirection:"column"
            }}>
            <DialogContentText>회원 탈퇴를 하기 위해 아래 항목에 동의하세요</DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.sameEmail}
                onChange={handleToggle('sameEmail')}
              />
            }
            label="동일한 이메일로 가입 불가능"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.review}
                onChange={handleToggle('review')}
              />
            }
            label="작성한 리뷰는 삭제되지 않습니다"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.point}
                onChange={handleToggle('point')}
              />
            }
            label="보유하신 포인트는 소멸됩니다"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={handleCancel} color="primary" disabled={!Object.values(checkedItems).every((item)=>item===true)}>회원 탈퇴</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Quitdialog;
