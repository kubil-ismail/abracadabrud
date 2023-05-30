// import { useTranslation } from 'react-i18next';

// const { t } = useTranslation;
export const guidePayments = [
  {
    payment_code: 'va_bca',
    guide_name: 'BCA ATM',
    guide_list: [
      { id: 1, title: '1. Select other transactions on the main menu.' },
      { id: 2, title: '2. Select transfer.' },
      {
        id: 3,
        title: '3. Select to BCA virtual account.'
      },
      {
        id: 4,
        title: '4. Insert BCA Virtual account number.'
      },
      { id: 5, title: '5. Insert the payable amount, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bca',
    guide_name: 'Klik BCA',
    guide_list: [
      { id: 1, title: '1. Select fund transfer.' },
      { id: 2, title: '2. Select transfer to BCA virtual account.' },
      { id: 3, title: '3. Insert BCA virtual account number.' },
      {
        id: 4,
        title: '4. Insert the payable amount, then confirm.'
      },
      { id: 5, title: '5. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bca',
    guide_name: 'M-BCA ( BCA Mobile )',
    guide_list: [
      { id: 1, title: '1. Select m-Transfer.' },
      { id: 2, title: '2. Select BCA virtual account.' },
      { id: 3, title: '3. Insert BCA virtual account number.' },
      {
        id: 4,
        title: '4. Insert the payable amount, then confirm.'
      },
      { id: 5, title: '5. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bri',
    guide_name: 'ATM',
    guide_list: [
      { id: 1, title: '1. Select other transactions on the main menu.' },
      { id: 2, title: '2. Select payment.' },
      { id: 3, title: '3. Select other.' },
      { id: 4, title: '4. Select BRIVA.' },
      { id: 5, title: '5. Insert BRIVA number, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bri',
    guide_name: 'Internet Banking',
    guide_list: [
      { id: 1, title: '1. Select payment & purchase.' },
      { id: 2, title: '2. Select BRIVA.' },
      { id: 3, title: '3. Insert BRIVA Number, then confirm.' },
      { id: 4, title: '4. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bri',
    guide_name: 'BRImo',
    guide_list: [
      { id: 1, title: '1. Select payment.' },
      { id: 2, title: '2. Select BRIVA.' },
      { id: 3, title: '3. Insert BRIVA number, then confirm.' },
      { id: 4, title: '4. Payment completed.' }
    ]
  },

  {
    payment_code: 'va_bni',
    guide_name: 'ATM',
    guide_list: [
      { id: 1, title: '1. Select others on the main menu.' },
      { id: 2, title: '2. Select transfer.' },
      { id: 3, title: '3. Select to BNI account.' },
      { id: 4, title: '4. Insert the payment account number.' },
      { id: 5, title: '5. Insert the payable amount, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bni',
    guide_name: 'Internet Banking',
    guide_list: [
      { id: 1, title: '1. Select transaction, then transfer administration info.' },
      { id: 2, title: '2. Select set destination account.' },
      { id: 3, title: '3. Insert account info, then Confirm.' },
      { id: 4, title: '4. Select transfer, then transfer to BNI account.' },
      { id: 5, title: '5. Insert payment details, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_bni',
    guide_name: 'Mobile Banking',
    guide_list: [
      { id: 1, title: '1. Select transfer.' },
      { id: 2, title: '2. Select virtual account billing.' },
      { id: 3, title: '3. Select the debit account you want to use.' },
      { id: 4, title: '4. Insert the virtual account number, then confirm.' },
      { id: 5, title: '5. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_mandiri',
    guide_name: 'ATM Mandiri',
    guide_list: [
      { id: 1, title: '1. Select Pay/Buy on the main menu.' },
      { id: 2, title: '2. Select Others.' },
      { id: 3, title: '3. Select Multi Payment.' },
      { id: 4, title: '4. Insert company code 70012.' },
      { id: 5, title: '5. Insert virtual account number, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'va_mandiri',
    guide_name: 'Internet Banking',
    guide_list: [
      { id: 1, title: '1. Select Payment on the main menu.' },
      { id: 2, title: '2. Select Multi Payment.' },
      { id: 3, title: '3. Select From account.' },
      { id: 4, title: '4. Select Midtrans in the Service provider field.' },
      { id: 5, title: '5. Insert virtual account number, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'cardless_akulaku',
    guide_name: 'Akulaku PayLater',
    guide_list: [
      {
        id: 1,
        title:
          '1. Click Pay Now, then you will be directed to the Akulaku PayLater Payment Center page.'
      },
      { id: 2, title: '2. Select the desired installment tenor.' },
      { id: 3, title: '3. Login to your Akulaku PayLater account.' },
      {
        id: 4,
        title:
          '4. Enter the verification code (OTP) that has been sent to your mobile number, then click Next.'
      },
      { id: 5, title: '5. Confirm and finish your payment.' }
    ]
  },
  {
    payment_code: 'va_permata',
    guide_name: 'ATM Permata/ALTO',
    guide_list: [
      { id: 1, title: '1. Select other transactions on the main menu.' },
      { id: 2, title: '2. Select payment.' },
      { id: 3, title: '3. Select other payments.' },
      { id: 4, title: '4. Select virtual account.' },
      { id: 5, title: '5. Insert virtual account number, then confirm.' },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'debit_danamon',
    guide_name: 'Danamon Online Banking',
    guide_list: [
      { id: 1, title: '1. Tap Pay Now and you will be redirected to Danamon Online Banking page.' },
      { id: 2, title: '2. Login and select the source of fund you’d like to use.' },
      { id: 3, title: '3. Recheck your transaction details.' },
      { id: 4, title: '4. Confirm your payment by entering the token code, and click Next.' },
      {
        id: 5,
        title:
          '5. Keep the merchant reference and payment reference number, then click Next to return to the merchant’s page.'
      },
      { id: 6, title: '6. Payment completed.' }
    ]
  },
  {
    payment_code: 'ewallet_gopay',
    isQris: true,
    guide_name: 'QR Code',
    guide_list: [
      { id: 1, title: '1. Open the application that has a QRIS scan feature' },
      { id: 2, title: '2. Scan the QR code on your monitor.' },
      { id: 3, title: '3. Confirm payment in the app.' },
      { id: 4, title: '4. Payment completed.'}
    ]
  },
  {
    payment_code: 'ewallet_gopay',
    guide_name: 'Gojek Pay Now',
    guide_list: [
      { id: 1, title: '1. Click Pay now.' },
      { id: 2, title: '2. The Gojek app will open.' },
      { id: 3, title: '3. Confirm payment in the app.' },
      { id: 4, title: '4. Payment completed.'}
    ]
  },
  {
    payment_code: 'ewallet_gopay',
    guide_name: 'QR Code',
    guide_list: [
      { id: 1, title: '1. Open the application that has a QRIS scan feature' },
      { id: 2, title: '2. Scan the QR code on your monitor.' },
      { id: 3, title: '3. Confirm payment in the app.' },
      { id: 4, title: '4. Payment completed.'}
    ]
  },
  {
    payment_code: 'ewallet_shopeepay',
    guide_name: 'Shopeepay QR Code',
    guide_list: [
      { id: 1, title: '1. Click Pay now.' },
      { id: 2, title: '2. The Shopee app will open.' },
      { id: 3, title: '3. Confirm payment in the Shopee application.' },
      { id: 4, title: '4. Payment completed.' }
    ]
  },
  {
    payment_code: 'outlet_alfamart',
    guide_name: 'Alfamart Payment Instruction',
    guide_list: [
      {
        id: 1,
        title:
          '1. Go to the nearest Alfamart/Alfamidi/Dan+Dan store near you and show your barcode/payment code to the cashier.'
      },
      { id: 2, title: '2. The cashier will confirm your transaction details.' },
      { id: 3, title: '3. Confirm your payment with the cashier.' },
      {
        id: 4,
        title:
          '4. You will get an e-mail containing payment confirmation if your transaction is successfully processed.'
      },
      {
        id: 5,
        title:
          "5. Please keep your Alfamart payment receipt in case you'll need further help via support."
      }
    ]
  },
  {
    payment_code: 'outlet_indomaret',
    guide_name: 'Indomaret Payment Instruction',
    guide_list: [
      {
        id: 1,
        title:
          '1. If you’re going to pay on the counter, go to the nearest Indomaret store and show your payment code/barcode to the cashier.'
      },
      {
        id: 2,
        title:
          '2. The cashier will confirm your transaction details. Once your transaction is successful, you’ll receive the payment confirmation e-mail.'
      },
      { id: 3, title: '3. If you’re going to pay via i.saku, open the app and tap Bayar.' },
      {
        id: 4,
        title: '4. Choose the merchant you’d like to pay to, and enter your payment code.'
      },
      { id: 5, title: '5. Tap Selanjutnya and check your transaction details.' },
      { id: 6, title: '6. Tap Bayar sekarang to confirm your payment.' },
      {
        id: 7,
        title:
          '7. Please keep your Indomaret payment receipt in case you’ll need further help via support.'
      }
    ]
  }
];
export const cmBeforeEnroll = [
  {
    element: '.enroll-now',
    title: 'Your journey is one click away!',
    intro: 'Enroll to this event and select your role'
  }
];
export const cmAfterEnrollContestant = [
  {
    element: '.point',
    title: 'Point: You Ammunition to Compete',
    intro: 'Gather point as much as possible, to increase you winning chance in LUCKY DRAW'
  },
  {
    element: '.share-ref',
    title: 'More Friends, more chance to win!',
    intro: 'For each friends you refer onto abracadabra, you’ll be rewarded an additional points'
  },
  {
    element: '.hidden-talents',
    title: 'Hidden talents waiting to discoverd',
    intro:
      'Explore hundreds of performers video in this section, simply cilck the thumbnail and enjoy the performance.'
  },
  {
    element: '.video-vote',
    title: 'Love it ? Vote it.',
    intro:
      'Support your favorite performer by giving a vote through thier videos. You can give more then one vote per performer. Special Lucky Draw chance will be reward to you if the performer wins'
  },
  {
    element: '.step-video-sponsor',
    title: 'Sponsor Video',
    intro: 'You’ll get 5 points every sponsors video you watch up till the end'
  }
];
export const cmAfterEnrollPerformer = [
  {
    element: '.rank-stand',
    title: 'See where your video stand among others',
    intro:
      'Ranking is determined by number of vote you received. Highest ranking means highest vote received'
  },
  {
    element: '.upload-video',
    title: 'Upload Video',
    intro: 'Join a weekly video contest, you can upload more than one video per event'
  },
  {
    element: '.point',
    title: 'Point: You Ammunition to Compete',
    intro: 'Gather point as much as possible, to increase you winning chance in LUCKY DRAW'
  },
  {
    element: '.share-btn',
    title: 'Don’t keep your talent hidden',
    intro:
      'Share your performance and gain vote as much as possible. Performer with the most vote will win the competition'
  },
  {
    element: '.step-video-sponsor',
    title: 'Sponsor Video',
    intro: 'You’ll get 5 points every sponsors video you watch up till the end'
  }
];
export const cmBeforeUploadVideo = [
  {
    element: '.rank-stand',
    title: 'See where your video stand among others',
    intro:
      'Ranking is determined by number of vote you received. Highest ranking means highest vote received'
  },
  {
    element: '.upload-video',
    title: 'Upload Video',
    intro: 'Join a weekly video contest, you can upload more than one video per event'
  }
];

export const listFAQ = [
  {
    id: 1,
    question:
      'What is the different between abracadabra Starquest and wepop come together concert?',
    answer: [
      {
        id: 1,
        description:
          'WePop is the event itself, while abracadabra Starquest is the one that can help you not only to get WePop ticket concert for free, but also perform on that stage'
      }
    ]
  },
  {
    id: 2,
    question: 'How to join as Performer?',
    answer: [
      {
        id: 1,
        description: 'Upload your performance video to Youtube and copy the video link'
      },
      {
        id: 2,
        description: 'Enter abracadabra.event'
      },
      {
        id: 3,
        description: 'Sign up as PERFORMER and complete your profile'
      },
      {
        id: 4,
        description: 'Paste your video link to provided section'
      },
      {
        id: 5,
        description: 'Invite your friends and family to vote for you'
      },
      {
        id: 6,
        description: 'The more vote you get, the wider your chance to perform at WePop'
      },
      {
        id: 7,
        description:
          'If you upgrade your account to Premium, you can upload more than 1 video which can increase your chance to win'
      }
    ]
  },
  {
    id: 3,
    question: 'How to join as Contestant?',
    answer: [
      {
        id: 1,
        description: 'Enter abracadabra.events'
      },
      {
        id: 2,
        description: 'Sign up as CONTESTANT and complete your profile'
      },
      {
        id: 3,
        description: 'Collect the points by do the challenges inside the website.'
      },
      {
        id: 4,
        description:
          'CONTESTANT with most points will win the prizes such as concert ticket, Meet & Greet with Rossa, Tulus, and Bunga Citra Lestari, accomodation (flight and hotel), and trip around Jakarta'
      },
      {
        id: 5,
        description: 'Every week, you can upgrade your account to Premium and get free 100 points'
      }
    ]
  },
  {
    id: 4,
    question: 'What is the different between Performer and Contestant?',
    answer: [
      {
        id: 1,
        description:
          "The Contestant is competing to get the prize of concert ticket and Meet & Greet by collecting the most points, while Performer's prize is to perform on the stage and the way to achive it is by collecting the most votes from their performance video"
      }
    ]
  },
  {
    id: 5,
    question: 'How many Contestant can won?',
    answer: [
      {
        id: 1,
        description:
          'There will be 2 winner for the most point, and 1 winner for picking the Performer winner at the end of the competiton'
      }
    ]
  },
  {
    id: 6,
    question: 'How many Performer can won?',
    answer: [
      {
        id: 1,
        description:
          'At the end of the competition, 3 Performers with the most vote will perform as the opening act for each artists in WePop'
      }
    ]
  },
  {
    id: 7,
    question: 'Winner prizes',
    answer: [
      {
        id: 1,
        description:
          'There will be amazing prizes, like concert ticket, Meet & Greet, free accomodation (round trip plane ticket), stay at 5 star hotel, and trip around Jakarta'
      }
    ]
  },
  {
    id: 8,
    question: 'Determining the winning Performer',
    answer: [
      {
        id: 1,
        description:
          'The Performer winner will be picked from the most vote. Keep up wih our updates every friday.'
      }
    ]
  },
  {
    id: 9,
    question: 'Determining the winning Contestant',
    answer: [
      {
        id: 1,
        description:
          'Every week, 2 Contestant winner will be picked from the most points and at the end of the competition, there will be a special lucky draw for those who vote for the Performer winner'
      }
    ]
  },
  {
    id: 10,
    question: 'Can i win just by using Freemium?',
    answer: [
      {
        id: 1,
        description: 'No, everyone deserves to win, including Freemium and Premium'
      }
    ]
  },
  {
    id: 11,
    question: 'Who can compete?',
    answer: [
      {
        id: 1,
        description: 'Everyone can join the competition'
      }
    ]
  },
  {
    id: 12,
    question: 'Can i win more than once?',
    answer: [
      {
        id: 1,
        description: "To be fair, those who's already win, can't win anymore in the next week"
      }
    ]
  },
  {
    id: 13,
    question: 'Can the winner prize changed into money?',
    answer: [
      {
        id: 1,
        description: "We're sorry we can't change the prize into money"
      }
    ]
  },
  {
    id: 14,
    question:
      'How many artists does The Contesant winner can do Meet & Greet? 3 artists or just 1?',
    answer: [
      {
        id: 1,
        description: 'You can only do Meet & Greet with 1 artist'
      }
    ]
  },
  {
    id: 15,
    question: 'Is there a special training for Performer winner?',
    answer: [
      {
        id: 1,
        description: 'There will be special training from our team for Performer winner'
      }
    ]
  },
  {
    id: 16,
    question: 'Are Performer only for individual or band?',
    answer: [
      {
        id: 1,
        description: 'You can be solo, duo, trio or band to join the competition as Performer'
      }
    ]
  },
  {
    id: 17,
    question: 'wepop date and venue',
    answer: [
      {
        id: 1,
        description: 'wepop come together will be held on March 27th 2023'
      }
    ]
  }
];
const MasterData = {
  guidePayments,
  listFAQ,
  cmBeforeEnroll,
  cmAfterEnrollContestant,
  cmAfterEnrollPerformer,
  cmBeforeUploadVideo
};

export default MasterData;
