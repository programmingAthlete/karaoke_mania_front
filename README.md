# Karaoke_mania_front

Front end of the Karaoke Mania project - platform to help a karaoke DJ to control the playlist of karake songs

### Funtionalities

<ul>
<li>Allows the users to select song</li>
<li>Allows the users to edit the selected songs</li>
<li>Allows the DJ to upload a CSV file with the songs that can be selected by the users</li>
<li>Allows the DJ to keep track of the queue of the selected songs</li>
<li>Allows the DJ to do actions on the queue of the selected songs</li>
</ul>

### Additional experimental functionality

Just to experiment, the non-authenticating Diffie-Helman key exchange and AES encryption have been implemented. This is not needed if the app communicated over HTTPS, in which case, this would result in a double encryption.

The AES encryption is done in the classic mode (not IND-CPA secure) and only on a sub-section of the payload - only the information which need to keep secrecy (email of the users) is encrypted.
Notice that, because of leakage of the non-encrypted part of the payload, the overall encryption scheme remains IND-CPA insecure even if an appropriate IND-CPA secure AES mode is used.
